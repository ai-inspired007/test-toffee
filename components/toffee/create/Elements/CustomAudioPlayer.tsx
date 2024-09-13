import { useState, useRef, useEffect } from "react";
import { RiPlayFill } from "../../icons/PlayFill";
import { RiVoiceprintLine } from "../../icons/VoicePrint";
import { VoiceType } from "@/app/(create)/create/voice/page";

interface CustomAudioPlayerProps {
  voice: VoiceType | undefined;
  index: number;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  voice,
  index,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    if (!voice?.audioUrl) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, []);

  const getBackgroundColor = (index: number): string => {
    switch (index % 4) {
      case 0:
        return "#F7604C";
      case 1:
        return "#6E3FF3";
      case 2:
        return "#BCB8C5";
      default:
        return "#CDF74C";
    }
  };

  return (
    <div
      id={`audio_player_${voice?.voiceId || "temp"}`}
      className="cursor-pointer"
      onClick={togglePlayPause}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full`}
        style={{ backgroundColor: getBackgroundColor(index) }}
      >
        {isPlaying ? (
          <RiVoiceprintLine className="h-6 w-6" />
        ) : (
          <RiPlayFill className="h-6 w-6" />
        )}
      </div>
      <audio
        ref={audioRef}
        id={`voice_library_audio_${voice?.voiceId || "temp"}`}
        hidden
      >
        <source
          id={`voice_library_audio_source_${voice?.voiceId}`}
          src={voice?.audioUrl || ""}
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
};

export default CustomAudioPlayer;
