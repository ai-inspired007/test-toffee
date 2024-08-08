"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, Settings, Phone, Pause, Mic, MicOff, Play } from 'lucide-react';
import Image from "next/image";
import { Character } from "@prisma/client";
import {
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import { Message, useChat } from "ai/react";
import {
  contextualGreeting,
  generateRandomString,
  utteranceText,
} from "@/lib/helpers";

import { useMicVAD } from "@ricky0123/vad-react";
import { useNowPlaying } from "react-nowplaying";
import { useQueue } from "@uidotdev/usehooks";
import { MessageMetadata } from "@/lib/types";
import { useDeepgram } from "@/contexts/Deepgram";
import { useMessageData } from "@/contexts/MessageMetadata";
import { useMicrophone } from "@/contexts/Microphone";
import { useAudioStore } from "@/contexts/AudioStore";
import { GradientLoading } from "../../icons/GradientLoading";
import { CharacterAvatarBefore } from "../../icons/CharacterAvatarBefore";
import { CharacterAvatarBack } from "../../icons/CharacterAvatarBack";
import { UserAvatarBefore } from "../../icons/UserAvatarBefore";
import { UserAvatarBack } from "../../icons/UserAvatarBack";
import { DefaultAvatar } from "../../icons/DefaultAvatar";

const VoiceChat = ({
  character
}: {
  character: Character
  }) => {
  const [isPause, setIsPause] = useState(false);
  const [isMicrophone, setIsMicrophone] = useState(false);
  const [isCharacter, setIsCharacter] = useState(true);
  const { ttsOptions, connection, connectionReady } = useDeepgram();
  const { addAudio } = useAudioStore();
  const { player, stop: stopAudio, play: startAudio } = useNowPlaying();
  const { addMessageData } = useMessageData();
  const {
    microphoneOpen,
    queue: microphoneQueue,
    queueSize: microphoneQueueSize,
    firstBlob,
    removeBlob,
    stream,
    startMicrophone,
    stopMicrophone
  } = useMicrophone();

  const microphoneToggle = useCallback(
    async (e: Event) => {
      e.preventDefault();

      if (microphoneOpen) {
        stopMicrophone();
      } else {
        startMicrophone();
      }
    },
    [microphoneOpen, startMicrophone, stopMicrophone]
  );

  /**
   * Queues
   */
  const {
    add: addTranscriptPart,
    queue: transcriptParts,
    clear: clearTranscriptParts,
  } = useQueue<{ is_final: boolean; speech_final: boolean; text: string }>([]);

  /**
   * State
   */
  const [isProcessing, setProcessing] = useState(false);

  /**
   * Request audio from API
   */
  const requestTtsAudio = useCallback(
    async (message: Message) => {
      const start = Date.now();
      const model = ttsOptions?.model ?? "aura-asteria-en";

      const res = await fetch(`/api/speak?model=${model}`, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(message),
      });

      const headers = res.headers;

      const blob = await res.blob();

      startAudio(blob, "audio/mp3", message.id).then(() => {
        addAudio({
          id: message.id,
          blob,
          latency: Number(headers.get("X-DG-Latency")) ?? Date.now() - start,
          networkLatency: Date.now() - start,
          model,
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ttsOptions?.model]
  );

  const [llmNewLatency, setLlmNewLatency] = useState<{
    start: number;
    response: number;
  }>();

  const onFinish = useCallback(
    (msg: any) => {
      requestTtsAudio(msg);
    },
    [requestTtsAudio]
  );

  const onResponse = useCallback((res: Response) => {
    (async () => {
      setLlmNewLatency({
        start: Number(res.headers.get("x-llm-start")),
        response: Number(res.headers.get("x-llm-response")),
      });
    })();
  }, []);

  const greetingMessage: Message = useMemo(
    () => ({
      id: generateRandomString(7),
      role: "assistant",
      content: contextualGreeting(character.greeting),
    }),
    []
  );

  /**
   * AI SDK
   */
  const {
    messages: chatMessages,
    append,
    isLoading: llmLoading,
  } = useChat({
    id: "aura",
    api: `/api/chat/${character.id}/voice`,
    initialMessages: [greetingMessage],
    onFinish,
    onResponse,
  });

  const [currentUtterance, setCurrentUtterance] = useState<string>();
  const [failsafeTimeout, setFailsafeTimeout] = useState<NodeJS.Timeout>();
  const [failsafeTriggered, setFailsafeTriggered] = useState<boolean>(false);

  const onSpeechEnd = useCallback(() => {
    /**
     * We have the audio data context available in VAD
     * even before we start sending it to deepgram.
     * So ignore any VAD events before we "open" the mic.
     */
    if (!microphoneOpen) return;

    setFailsafeTimeout(
      setTimeout(() => {
        if (currentUtterance) {
          console.log("failsafe fires! pew pew!!");
          setFailsafeTriggered(true);
          append({
            role: "user",
            content: currentUtterance,
          });
          clearTranscriptParts();
          setCurrentUtterance(undefined);
        }
      }, 1500)
    );

    return () => {
      clearTimeout(failsafeTimeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneOpen, currentUtterance]);

  const onSpeechStart = () => {
    /**
     * We have the audio data context available in VAD
     * even before we start sending it to deepgram.
     * So ignore any VAD events before we "open" the mic.
     */
    if (!microphoneOpen) return;

    /**
     * We we're talking again, we want to wait for a transcript.
     */
    setFailsafeTriggered(false);

    if (!player?.ended) {
      stopAudio();
      console.log("barging in! SHH!");
    }
  };

  useMicVAD({
    startOnLoad: true,
    stream,
    onSpeechStart,
    onSpeechEnd,
    positiveSpeechThreshold: 0.6,
    negativeSpeechThreshold: 0.6 - 0.15,
  });

  useEffect(() => {
    if (llmLoading) return;
    if (!llmNewLatency) return;

    const latestLlmMessage: MessageMetadata = {
      ...chatMessages[chatMessages.length - 1],
      ...llmNewLatency,
      end: Date.now(),
      ttsModel: ttsOptions?.model,
    };

    addMessageData(latestLlmMessage);
  }, [
    chatMessages,
    llmNewLatency,
    setLlmNewLatency,
    llmLoading,
    addMessageData,
    ttsOptions?.model,
  ]);

  /**
   * Contextual functions
   */
  const requestWelcomeAudio = useCallback(async () => {
    requestTtsAudio(greetingMessage);
  }, [greetingMessage, requestTtsAudio]);

  const startConversation = useCallback(() => {
    // add a stub message data with no latency
    const welcomeMetadata: MessageMetadata = {
      ...greetingMessage,
      ttsModel: ttsOptions?.model,
    };

    addMessageData(welcomeMetadata);

    // get welcome audio
    requestWelcomeAudio();
  }, [
    addMessageData,
    greetingMessage,
    requestWelcomeAudio,
    ttsOptions?.model,
  ]);

  useEffect(() => {
    const onTranscript = (data: LiveTranscriptionEvent) => {
      let content = utteranceText(data);

      // i only want an empty transcript part if it is speech_final
      if (content !== "" || data.speech_final) {
        /**
         * use an outbound message queue to build up the unsent utterance
         */
        addTranscriptPart({
          is_final: data.is_final as boolean,
          speech_final: data.speech_final as boolean,
          text: content,
        });
      }
    };

    const onOpen = (connection: LiveClient) => {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
    };

    if (connection) {
      connection.addListener(LiveTranscriptionEvents.Open, onOpen);
    }

    return () => {
      connection?.removeListener(LiveTranscriptionEvents.Open, onOpen);
      connection?.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      );
    };
  }, [addTranscriptPart, connection]);

  const getCurrentUtterance = useCallback(() => {
    return transcriptParts.filter(({ is_final, speech_final }, i, arr) => {
      return is_final || speech_final || (!is_final && i === arr.length - 1);
    });
  }, [transcriptParts]);

  const [lastUtterance, setLastUtterance] = useState<number>();

  useEffect(() => {
    const parts = getCurrentUtterance();
    const last = parts[parts.length - 1];
    const content = parts
      .map(({ text }) => text)
      .join(" ")
      .trim();

    /**
     * if the entire utterance is empty, don't go any further
     * for example, many many many empty transcription responses
     */
    if (!content) return;

    /**
     * failsafe was triggered since we last sent a message to TTS
     */
    if (failsafeTriggered) {
      clearTranscriptParts();
      setCurrentUtterance(undefined);
      return;
    }

    /**
     * display the concatenated utterances
     */
    setCurrentUtterance(content);

    /**
     * record the last time we recieved a word
     */
    if (last.text !== "") {
      setLastUtterance(Date.now());
    }

    /**
     * if the last part of the utterance, empty or not, is speech_final, send to the LLM.
     */
    if (last && last.speech_final) {
      clearTimeout(failsafeTimeout);
      append({
        role: "user",
        content,
      });
      clearTranscriptParts();
      setCurrentUtterance(undefined);
    }
  }, [
    getCurrentUtterance,
    clearTranscriptParts,
    append,
    failsafeTimeout,
    failsafeTriggered,
  ]);

  /**
   * magic microphone audio queue processing
   */
  useEffect(() => {
    const processQueue = async () => {
      if (microphoneQueueSize > 0 && !isProcessing) {
        setProcessing(true);

        if (connectionReady) {
          const nextBlob = firstBlob;

          if (nextBlob && nextBlob?.size > 0) {
            connection?.send(nextBlob);
          }

          removeBlob();
        }

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 200);
      }
    };

    processQueue();
  }, [
    connection,
    microphoneQueue,
    removeBlob,
    firstBlob,
    microphoneQueueSize,
    isProcessing,
    connectionReady,
  ]);

  /**
   * keep deepgram connection alive when mic closed
   */
  useEffect(() => {
    let keepAlive: any;
    if (connection && connectionReady && !microphoneOpen) {
      keepAlive = setInterval(() => {
        // should stop spamming dev console when working on frontend in devmode
        if (connection?.getReadyState() !== LiveConnectionState.OPEN) {
          clearInterval(keepAlive);
        } else {
          connection.keepAlive();
        }
      }, 10000);
    } else {
      clearInterval(keepAlive);
    }

    // prevent duplicate timeouts
    return () => {
      clearInterval(keepAlive);
    };
  }, [connection, connectionReady, microphoneOpen]);

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar relative">
      <div className="flex flex-col rounded-[8px] w-full h-2/5 items-center justify-start relative p-6 bg-gradient-to-b from-[#E59094]/30 to-[#121212]">
        {/* <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer top-6 right-6 fixed" onClick={() => {}} /> */}
        <div className="w-full px-6 py-3 flex justify-end border-b border-b-white/10">
          <div className="flex flex-row gap-5 items-center text-white">
            <Settings className="h-6 w-6 cursor-pointer"/>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-[8px] w-full h-3/5 items-center justify-start relative p-6 bg-[#121212]" />
      <div className="flex w-full justify-center items-center absolute top-[96px]">
        <span className=" text-white font-inter text-center text-2xl font-semibold not-italic">
          {isPause ? "Chat is one pause"
            : llmLoading ? "Ask your question"
              : "Listening"
          }
        </span>
      </div>
      <div className="flex w-full items-center justify-center absolute top-[332px]">
        {!connection &&
          <div className="absolute">
            <GradientLoading />
          </div>
        }
        {isPause && (
          <>
            <div className="absolute w-[218px] h-[218px] rounded-full bg-[#202020]" />
            <div className="absolute w-[200px] h-[200px] rounded-full bg-[#2F2F2F]" />
          </>
        )}
        {isCharacter ?
          <>
            <div className="absolute">
              <CharacterAvatarBack  />
            </div>
            <div className="absolute">
              <CharacterAvatarBefore />
            </div>
            <Image
              className="absolute rounded-full"
              src={character.image}
              alt={character.name + " Image"}
              width={180}
              height={180}
            />
          </>
          :
          <>
            <div className="absolute">
              <UserAvatarBack  />
            </div>
            <div className="absolute">
              <UserAvatarBefore />
            </div>
            <div className="absolute rounded-full">
              <DefaultAvatar />
            </div>
          </>
        }
      </div>
      <div className="flex flex-col w-full justify-center items-center absolute top-[570px]">
        <span className="text-[#777777] font-inter text-sm font-normal">Current session</span>
      </div>
      <div className="flex flex-col w-full justify-center items-center absolute top-[600px]">
        <span className=" text-white font-inter text-2xl font-semibold">20:42</span>
      </div>
      <div className="flex w-full justify-center items-center gap-4 absolute top-[734px]">
        
        <div className={`w-16 h-16 ${isMicrophone ? "bg-[#202020]" : "bg-white"} rounded-full flex items-center justify-center cursor-pointer`}>
          {isMicrophone ?
            <Mic size={24} className="text-white" onClick={(e: any) => microphoneToggle(e)} />
            :
            <MicOff size={24} className="text-black" onClick={(e: any) => microphoneToggle(e)} />
          }
        </div>
        <div className={`w-16 h-16 ${microphoneOpen ? "bg-white" : "bg-[#202020]"}  rounded-full flex items-center justify-center cursor-pointer`}>
          {microphoneOpen ?
            <Play size={24} className="text-black" onClick={(e: any) => microphoneToggle(e)} />
            :
            <Pause size={24} className="text-white" onClick={(e: any) => microphoneToggle(e)} />
          }
        </div>
        <div className="w-16 h-16 bg-[#DF1C41] rounded-full flex items-center justify-center cursor-pointer">
          <Phone size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;