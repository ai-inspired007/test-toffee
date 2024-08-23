"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo, Dispatch, SetStateAction } from "react";
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
import { useGlobalAudioPlayer, useAudioPlayer } from 'react-use-audio-player';
import { useMediaQuery } from "react-responsive";
const VoiceChat = ({
  character,
  isVoice,
  setIsVoice
}: {
  character: Character,
  isVoice: boolean,
  setIsVoice: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isGreeting, setIsGreeting] = useState(false);
  const [isCharacter, setIsCharacter] = useState(true);

  const [isPause, setPause] = useState(false);
  const [isEnd, setEnd] = useState(false);

  const { ttsOptions, connection, connectionReady } = useDeepgram();
  const {
    microphoneOpen,
    queue: microphoneQueue,
    queueSize: microphoneQueueSize,
    firstBlob,
    removeBlob,
    stream,
    startMicrophone,
    stopMicrophone,
    endMicrophone,
    microphone
  } = useMicrophone();

  enum CallState {
    Listening,
    Asking,
    Speaking,
  }

  const [currentState, setCurrentState] = useState<CallState>();
  const { load, play, pause, playing } = useGlobalAudioPlayer();

  useEffect(() => {
    startMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const callToggle = useCallback(
    async (e: Event) => {
      e.preventDefault();
      setPause(!isPause);
    },
    [isPause]
  );

  useEffect(() => {
    if (isPause) {
      switch (currentState) {
        case CallState.Listening:
          stopMicrophone();
        case CallState.Asking:
          context.suspend();
        case CallState.Speaking:
          context.suspend();
        default:
      }
    } else {
      switch (currentState) {
        case CallState.Listening:
          startMicrophone()
        case CallState.Asking:
          context.resume();
        case CallState.Speaking:
          context.resume();
        default:
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPause]);

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

  const handleAudioPlay = () => {
    /**
     * We we're talking again, we want to wait for a transcript.
     */
    setFailsafeTriggered(false);
  };

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      setCurrentState(CallState.Speaking);
      setIsCharacter(true);
      load(audioUrl, {
        onend: () => {
          onSpeechEnd();
        },
        onplay: handleAudioPlay,
        autoplay: true,
        html5: true,
        format: 'mp3',
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ttsOptions?.model]
  );

  const AudioContext = window.AudioContext;
  const [context] = useState(new (AudioContext)());

  let audioStack: AudioBuffer[] = [];
  let nextTime = 0;

  function appendBuffer(buffer1: any, buffer2: any) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

  const scheduleBuffers = () => {
    if (isPause) return;

    while (audioStack.length) {
      let buffer = audioStack.shift();
      let source: any = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      if (nextTime == 0) nextTime = context.currentTime + 0.04; // add 50ms latency

      source.start(nextTime);
      nextTime += source.buffer.duration;

      source.onended = () => {
        if (Math.floor(nextTime) === Math.floor(context.currentTime)) {
          onSpeechEnd();
          context.suspend();
        }
      };
    }
  };

  const requestTest = useCallback(async (message: string) => {
    fetch(`/api/chat/${character.id}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    })
      .then((response) => {
        if (response.body) {
          setCurrentState(CallState.Speaking);
          setIsCharacter(true);
          context.resume();
          const reader = response.body.getReader();
          let header: any = null; //first 44bytes

          const read = () =>
            reader.read().then(({ value, done }) => {
              if (isEnd) {
                reader.cancel();
                return;
              }
              if (value && value.buffer) {
                let audioBuffer = null;
                if (header == null) {
                  //copy first 44 bytes (wav header)
                  header = value.buffer.slice(0, 44);
                  audioBuffer = value.buffer;
                } else {
                  audioBuffer = appendBuffer(header, value.buffer);
                }

                context.decodeAudioData(
                  audioBuffer,
                  function (buffer) {
                    audioStack.push(buffer);
                    if (audioStack.length) {
                      scheduleBuffers();
                    }
                  },
                  function (err) {
                    console.log("err(decodeAudioData): " + err);
                  },
                );
              }

              if (done) {
                return;
              }

              // continue reading
              read();
            });

          // start reading
          read();
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greetingMessage: Message = useMemo(
    () => ({
      id: generateRandomString(7),
      role: "assistant",
      content: contextualGreeting(character.greeting),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [currentUtterance, setCurrentUtterance] = useState<string>();
  const [failsafeTimeout, setFailsafeTimeout] = useState<NodeJS.Timeout>();
  const [failsafeTriggered, setFailsafeTriggered] = useState<boolean>(false);

  const onSpeechEnd = useCallback(() => {
    /**
     * We have the audio data context available in VAD
     * even before we start sending it to deepgram.
     * So ignore any VAD events before we "open" the mic.
     */
    setCurrentState(CallState.Listening);
    setIsCharacter(false);
    setFailsafeTimeout(
      setTimeout(() => {
        if (currentUtterance && !isPause) {
          console.log("failsafe fires! pew pew!!");
          setFailsafeTriggered(true);
          requestTest(currentUtterance)
          setCurrentState(CallState.Asking);
          setIsCharacter(false);
          clearTranscriptParts();
          setCurrentUtterance(undefined);
        }
      }, 1500)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneOpen, currentUtterance]);

  useEffect(() => {
    if (isGreeting) {
      requestWelcomeAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGreeting])

  /**
   * Contextual functions
   */
  const requestWelcomeAudio = useCallback(async () => {
    if (!isPause && !isEnd)
      requestTtsAudio(greetingMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greetingMessage, requestTtsAudio]);

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
      setIsGreeting(true);
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

  useEffect(() => {
    if (!isPause && !isEnd) {
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
      // if (last.text !== "") {
      //   setLastUtterance(Date.now());
      // }

      /**
       * if the last part of the utterance, empty or not, is speech_final, send to the LLM.
       */
      if (last && last.speech_final && !isPause) {
        clearTimeout(failsafeTimeout);
        requestTest(content)
        setCurrentState(CallState.Asking);
        setIsCharacter(false);
        clearTranscriptParts();
        setCurrentUtterance(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPause,
    isEnd,
    getCurrentUtterance,
    clearTranscriptParts,
    // append,
    failsafeTimeout,
    failsafeTriggered,
  ]);

  /**
   * magic microphone audio queue processing
   */
  useEffect(() => {
    const processQueue = async () => {
      if (microphoneQueueSize > 0 && !isProcessing && !isPause && !isEnd) {
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
    isPause,
    isEnd,
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
    if (connection && connectionReady && !microphoneOpen && isPause && isEnd) {
      keepAlive = setInterval(() => {
        // should stop spamming dev console when working on frontend in devmode
        if (connection?.getReadyState() !== LiveConnectionState.OPEN) {
          clearInterval(keepAlive);
        } else {
          connection.keepAlive();
        }
      }, 20000);
    } else {
      clearInterval(keepAlive);
    }

    // prevent duplicate timeouts
    return () => {
      clearInterval(keepAlive);
    };
  }, [connection, connectionReady, microphoneOpen, isPause, isEnd]);


  const onFinishChat = () => {
    setEnd(true);
    microphone?.stop();
    microphone?.start(250);
    microphone?.stop();
    stream?.getTracks().forEach(track => {
      track.stop();
    });
    endMicrophone();
    context.close();
    connection?.removeAllListeners();
    connection?.finish();
    setIsVoice(false);
  }

  const callingContent = useMemo(() => {
    if (isPause) {
      return "Chat is on pause"
    }
    switch (currentState) {
      case CallState.Listening:
        return "Listening";
      case CallState.Asking:
        return "Ask your question";
      case CallState.Speaking:
        return "";
      default:
        return "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState, isPause]);

  const callingAvatar = useMemo(() => {
    if (!connectionReady) {
      return (
        <div className="absolute">
          <GradientLoading />
        </div>
      );
    }

    if (isPause) {
      return (
        <>
          <div className="absolute w-[218px] h-[218px] rounded-full bg-[#202020]" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-[#2F2F2F]" />
        </>
      );
    }

    switch (currentState) {
      case CallState.Asking:
        return (
          <>
            <div className="absolute w-[218px] h-[218px] rounded-full bg-[#202020]" />
            <div className="absolute w-[200px] h-[200px] rounded-full bg-[#2F2F2F]" />
          </>
        );
      case CallState.Listening:
      case CallState.Speaking:
        if (isCharacter) {
          return (
            <>
              <div className="absolute">
                <CharacterAvatarBack />
              </div>
              <div className="absolute">
                <CharacterAvatarBefore />
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="absolute">
                <UserAvatarBack />
              </div>
              <div className="absolute">
                <UserAvatarBefore />
              </div>
            </>
          );
        }
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionReady, currentState, isCharacter])
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar relative">
      <div className="bg-gradient-to-b from-[#E59094]/30 via-[#121212] via-[25%] to-[#121212] sm:rounded-[8px]  h-full w-full flex flex-col justify-start">
        <div className="hidden sm:flex w-full items-center justify-end px-6 py-4 text-white">
          <Settings className="h-6 w-6 cursor-pointer" />
        </div>
        <div className="flex flex-col h-full items-center justify-center">
          <div className="flex w-full justify-center items-center">
            <span className=" text-white  text-center text-2xl font-semibold not-italic">
              {callingContent}
            </span>
          </div>
          <div className="flex items-center justify-center w-full h-[200px] relative">
            {callingAvatar}
            {isCharacter ?
              <Image
                className="absolute rounded-full"
                src={character.image}
                alt={character.name + " Image"}
                width={180}
                height={180}
              />
              :
              <div className="absolute rounded-full">
                <DefaultAvatar />
              </div>
            }
          </div>
          <div className="flex flex-col w-full justify-center items-center mt-[138px]">
            <span className="text-[#777777]  text-sm font-normal">Current session</span>
            <span className=" text-white  text-2xl font-semibold">20:42</span>
          </div>
          <div className="flex w-full justify-center items-center gap-4 mt-[103px]">
            <div className={`w-16 h-16 ${microphoneOpen ? "bg-[#0e0808]" : "bg-white"} rounded-full flex items-center justify-center cursor-pointer`}>
              {microphoneOpen ?
                <Mic size={24} className="text-white" onClick={(e: any) => microphoneToggle(e)} />
                :
                <MicOff size={24} className="text-black" onClick={(e: any) => microphoneToggle(e)} />
              }
            </div>
            <div className={`w-16 h-16 ${!isPause ? "bg-[#202020]" : "bg-white"}  rounded-full flex items-center justify-center cursor-pointer`}>
              {!isPause ?
                <Pause size={24} className="text-white" onClick={(e: any) => callToggle(e)} />
                :
                <Play size={24} className="text-black" onClick={(e: any) => callToggle(e)} />
              }
            </div>
            <div className={`w-16 h-16 ${connectionReady ? "bg-[#DF1C41]" : "bg-[#202020]"} rounded-full flex items-center justify-center cursor-pointer`} onClick={() => connectionReady && onFinishChat()}>
              <Phone size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;