import React, { useState, useEffect, useRef } from 'react';
import BotPreview from "../../BotPreview";
import { useSession } from "next-auth/react";
import VoiceCard from "./VoiceCard";
import { TVoice } from '@/lib/types';
import { generateGradientBackgrounds } from '@/lib/utils';
import { Search } from "lucide-react";

interface CharacterVoiceProps {
  imageData: string | null;
  name: string;
  description: string;
  voices: TVoice[];
  selectedVoiceId: string | null;
  onSelectVoice: (voiceId: string) => void;
  categoryTags: string[];
}

const CharacterVoice: React.FC<CharacterVoiceProps> = ({ imageData, name, description, voices, selectedVoiceId, onSelectVoice, categoryTags }) => {
  const { data: session } = useSession();
  const user = session?.user || {};
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33FFF5', '#FF33C1', '#57FF33', '#3375FF', '#FFFF33', '#33BFFF'];
  const [gradientBackgrounds, setGradientBackgrounds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(["All"]);
  useEffect(() => {
    setGradientBackgrounds(generateGradientBackgrounds(colors, voices.length));
  }, [voices.length]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      setSelectedTags(["All"]);
    } else {
      setSelectedTags((prevTags) => {
        if (prevTags.includes(tag)) {
          // Remove tag  
          const newTags = prevTags.filter((t) => t !== tag);
          if (newTags.length === 0) {
            // If no tags left, select All  
            return ["All"];
          }
          return newTags;
        } else {
          // Add tag  
          return prevTags.includes("All")
            ? [tag]
            : [...prevTags, tag];
        }
      });
    }
  };
  const togglePlayPause = (index: number) => {
    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingIndex(null);
    } else {
      setPlayingIndex(index);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = voices[index].preview_url || '';
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingIndex(null);
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = handleAudioEnded;
    }
  }, []);

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchInput.toLowerCase());
    const matchesTags = selectedTags.includes("All") || voice.tags.some(tag => selectedTags.includes(tag.name));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="mt-5 flex w-full max-w-[1024px] flex-row justify-start">
      <div className="flex flex-col items-start justify-start gap-4 w-full">
        <div className="relative w-full">
          <Search className="absolute ml-2 h-full w-6 text-[#777777]" />
          <input
            type="text"
            className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent py-2 pl-10 pr-4 text-[13px] text-text-sub outline-none placeholder:text-text-tertiary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for voices"
          />
        </div>
        <div className="flex flex-row flex-wrap gap-1">
          {["All", ...categoryTags].map((tag) => (
            <span
              key={tag}
              className={`rounded-lg ${selectedTags.includes(tag) ? "bg-white text-black" : "bg-bg-2 text-text-additional"}  cursor-pointer border border-white/10 px-3 py-[7px] text-sm`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className='flex flex-col w-full gap-2 h-[500px] no-scrollbar overflow-auto'>
          {
            filteredVoices.map((voice, index) => (
              <div key={index} className='w-full'>
                <VoiceCard
                  voice={voice}
                  index={index}
                  togglePlayPause={togglePlayPause}
                  isPlaying={playingIndex === index}
                  gradientColor={gradientBackgrounds[index % colors.length]}
                  selected={selectedVoiceId === voice.id}
                  onSelect={() => onSelectVoice(voice.id)}
                />
              </div>
            ))
          }
        </div>
      </div>
      <div className="ml-[272px] hidden sm:block mt-5">
        <BotPreview
          imageData={imageData}
          user={user}
          name={name}
          description={description}
        />
      </div>
    </div>
  );
};

export default CharacterVoice;