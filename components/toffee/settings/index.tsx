"use client";
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { X, ChevronRightIcon, Trash2 } from 'lucide-react';
import { toast } from "react-toastify";
import Image from "next/image";
import { ChatTheme, Voice } from "@prisma/client";
import { RiVoiceprintLine } from "../icons/VoicePrint";
import { EllipseIcon } from "../icons/EllipseIcon";
import { validImageInputTypes } from "@/lib/upload/util";
import "./theme.style.css"
import VoiceLibraryModal from "./Elements/VoiceLibraryModal";
import { v4 as uuidv4 } from 'uuid';

interface ThemeProps {
  id: string;
  url: string;
}

interface ChatSetting {
  chat_model: string,
  prompt: string,
  voiceId: string,
  themeId: string,
}

interface ThemeFile {
  id: string,
  file: File,
}

const SettingsPage = ({
  chatSetting,
  voices,
  chatThemes
}: {
    chatSetting: ChatSetting | null;
    voices: Voice[];
  chatThemes: ChatTheme[];
}) => {
  const [openVoiceLibraryModal, setOpenVoiceLibraryModal] = useState(false);
  const toggleVoiceLibraryModal = () => setOpenVoiceLibraryModal((x) => !x);
  const [selectedVoice, setSelectedVoice] = useState<Voice | undefined>(voices.filter(item => item.id === chatSetting?.voiceId)[0]);
  const [loading, setLoading] = useState(false);
  
  const [systemPrompt, setSystemPrompt] = useState(chatSetting?.prompt);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const defaultThemes: ThemeProps[] = chatThemes.filter(item => item.shared === "Public").map((item => ({
    id: item.id,
    url: item.url
  })));

  const [themes, setThemes] = useState<ThemeProps[]>(chatThemes.filter(item => item.shared !== "Public"));
  const [selectedTheme, setSelectedTheme] = useState<ThemeProps | undefined>(chatThemes.filter(item => item.id === chatSetting?.themeId)[0]);

  const [addedFiles, setAddedFiles] = useState<ThemeFile[]>([]);

  const handleSave = async () => {
    let themeIds = themes.map(theme => theme.id);
    let newThemeFiles: ThemeFile[] = [];
    let removedThemes: ChatTheme[] = [];
    addedFiles.map(item => {
      if (themeIds.includes(item.id))
        newThemeFiles.push(item);
    });

    chatThemes.map(item => {
      if (item.shared !== "Public" && !themeIds.includes(item.id))
        removedThemes.push(item);
    })
    console.log(newThemeFiles, removedThemes);
    setLoading(true);
    try {
      const formData = new FormData();

      newThemeFiles?.forEach(item => {
        if (item) {
          if (item.id === selectedTheme?.id) {
            formData.append('selectedNewFile', item.file);
          } else if (item && item.file) {
            formData.append('newFiles', item.file);
          }
        }
      });
      formData.append("removedThemes", JSON.stringify(removedThemes));
      let remainData = {
        voiceId: selectedVoice?.id,
        themeId: selectedTheme?.id,
        prompt: systemPrompt,
        chat_model: "gpt-4o"
      }
      formData.append("remainData", JSON.stringify(remainData));
      
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const response = await fetch('/api/settings', {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success("Successfully created Candy!", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      } else {
        const error = await response.text();
        toast.error(`Error creating candy: ${error}`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error creating candy:', error);
      toast.error("Error creating candy", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validImageInputTypes.includes(file.type)) {
      const url = URL.createObjectURL(file);
      const newTheme = { id: uuidv4(), url };
      setThemes((prevThemes) => [...prevThemes, newTheme]);
      setAddedFiles((prev) => [...prev, {id: newTheme.id, file}]);
      setSelectedTheme(newTheme);
    }
  };

  const handleDeleteTheme = (id: string | number) => {
    if (themes.length >= 1) {
      setThemes((prevThemes) => prevThemes.filter(theme => theme.id !== id));
      if (selectedTheme?.id === id) {
        setSelectedTheme({ id: "0", url: "" });
      }
    } else {
      setSelectedTheme(defaultThemes[0])
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col rounded-[8px] bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6" onClick={() => false} />
        <span className="text-center  text-sm font-normal leading-[18px] absolute top-[68px] right-[28px] text-[#777777]">ESC</span>

        <div className="no-scrollbar flex h-full w-full max-w-[560px] flex-col mt-10 gap-6 overflow-x-visible items-center justify-center">
          <span className="w-full flex font-inter text-2xl font-semibold text-text-sub">Chat settings</span>

          <div className="w-full flex flex-col border-t-[1px] border-white/10" />

          <div className="w-full flex flex-col gap-6">
            <span className="font-inter font-medium text-[18px] leading-6 text-text-sub">General</span>
            <div className="w-full h-20 rounded-[8px] border-white/5 border bg-[#202020BF] relative cursor-pointer" onClick={() => setOpenVoiceLibraryModal(true)}>
              <div className="w-[148px] h-20 rounded-[8px] absolute top-0 left-0 bg-gradient-to-r from-[#F7604C4D] to-[#12121200]" />
              <EllipseIcon className="absolute left-[15px] top-[14px]" />
              <RiVoiceprintLine className="absolute left-[30px] top-7 w-6 h-6" />
              <div className="flex flex-col w-[213px] h-[42px] gap-2 left-20 top-5 absolute">
                <span className="font-inter font-medium text-[16px] leading-5 text-white">{selectedVoice?.name}</span>
                <span className="font-inter font-normal text-xs text-[#787878]">{selectedVoice?.description}</span>
              </div>
              <ChevronRightIcon className="absolute right-7 top-7" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <span className="font-inter font-normal text-xs text-text-tertiary">Chat model</span>
              <div className="flex flex-col px-4 py-4 gap-4 rounded-[8px] border border-white/5 bg-[#202020BF]">
                <div className="w-full flex justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-inter font-medium text-[14px] leading-[18px] text-text-sub">Toffe</span>
                    <span className="font-inter font-normal text-xs text-text-tertiary">Basic Chat GPT 4o model</span>
                  </div>
                  <div className="flex flex-col justify-center pr-2">
                    <input
                      type="radio"
                      name="radio"
                      className="custom-radio"
                      checked={chatSetting?.chat_model === "gpt-4o"}
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex border-t-[1px] border-white/5" />
                <div className="w-full flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-inter font-medium text-[14px] leading-[18px] text-text-sub">Toffe</span>
                    <span className="font-inter font-normal text-xs text-text-tertiary">Advanced unique model</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <button className="border-white/5 bg-toffe-gradient px-3 py-1 broder rounded-[28px] font-inter font-normal text-xs text-white">Only for Toffee+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col border-t-[1px] border-white/10" />

          <div className="w-full flex flex-col gap-6">
            <div className="w-full h-9 flex justify-between items-center">
              <span className="font-inter font-medium text-[18px] leading-6 text-text-sub">Customize background</span>
              <div className="flex justify-between items-center gap-[10px] rounded-[20px] px-4 py-[6px] bg-bg-3" onClick={triggerFileUpload}>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
                <span className="font-inter font-medium text-[14px] leading-[18px] text-text-sub cursor-pointer">Upload an image</span>
                <Image src={"/Union.svg"} alt="" className="w-[13px] h-[12px]" width={0} height={0} sizes="100vw" />
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-4">
              <span className="font-inter font-normal text-[14px] leading-[18px] text-text-tertiary">Basic themes</span>
              <div className="grid grid-cols-2 gap-[15px]">
                {defaultThemes.map((theme, idx) => (
                  <div key={idx} className={`relative rounded-[8px] flex flex-col items-center justify-center cursor-pointer ${theme.id === selectedTheme?.id ? "border border-solid border-[#BC7F44]" : ""}`}>
                    <Image src={theme.url} alt="" className="w-full h-full" width={0} height={0} sizes="100vw" onClick={() => setSelectedTheme(theme)} />
                    {theme.id === selectedTheme?.id && <div className="px-8 py-1 rounded-t-lg bg-[#BC7F44] text-[11px] text-white absolute bottom-0">Selected</div>}
                  </div>
                ))}
              </div>
              {<div
                className={`w-full min-h-[152px] rounded-[8px] flex flex-col ${selectedTheme?.url ? "p-8 relative": "justify-center items-center"} border border-white/10`}
                style={{ background: `url(${selectedTheme?.url}) center/cover no-repeat` }}
              >
                {selectedTheme?.url ?
                  <>
                    <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
                    <div className="relative z-10">
                      <div className="flex flex-row gap-3">
                        <Image src={"/characters/zero.png"} alt="" className="rounded-full w-8 h-8" width={32} height={32} />
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row text-text-sub items-center">
                            <span className="text-xs">Zero Two</span>
                            <span className="ml-2 rounded-full bg-[#202020] px-2 py-0.5 text-[11px] leading-[14px]">Tul.pa</span>
                          </div>
                          <span className="text-[#DEDFE4] bg-bg-3 px-4 py-3 text-sm font-light" style={{ borderRadius: "0px 16px 16px 16px" }}>{"Hi, how's it going?"}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <Image src={"/you.png"} alt="" className="rounded-full w-8 h-8" width={32} height={32} />
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row text-text-sub items-center ml-auto">
                            <span className="text-xs">You</span>
                          </div>
                          <span className="text-[#DEDFE4] bg-bg-3 px-4 py-3 text-sm font-light" style={{ borderRadius: "0px 16px 16px 16px" }}>{"Hey, could you give me some suggestions?"}</span>
                        </div>
                      </div>
                    </div>
                  </>
                  :
                  <span className="font-inter font-normal text-xs text-text-tertiary">No background</span>
                }
              </div>
              }
            </div>
            <div className="w-full flex flex-col gap-4">
              <span className="font-inter font-normal text-[14px] leading-[18px] text-text-tertiary">Uploaded</span>
              <div className="w-full flex gap-4 pb-4 theme-overflow-auto">
                {themes.map((theme, idx) => (
                  <div key={idx} className={`relative h-[152px] w-[229px] rounded-lg flex flex-col items-center justify-center cursor-pointer p-2 flex-shrink-0 ${theme.id === selectedTheme?.id ? "border-[1px] border-solid border-[#BC7F44]" : "border border-white/10"}`}>
                    <Image src={theme.url} alt="" className="w-full h-full object-cover rounded-lg" width={152} height={200} onClick={() => setSelectedTheme(theme)} />
                    {theme.id === selectedTheme?.id && <div className="px-8 py-1 rounded-t-lg bg-[#BC7F44] text-[11px] text-white absolute bottom-0">Selected</div>}
                    <button onClick={() => handleDeleteTheme(theme.id)} className="absolute top-3 right-3 bg-gray-900 text-white rounded-md p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col border-t-[1px] border-white/10" />

          <div className="w-full flex flex-col gap-6 ">
            <span className="w-full flex font-inter font-medium text-[18px] leading-6 text-text-sub">System prompt</span>
            <div className="w-full flex flex-col font-inter font-normal gap-2">
              <span className="text-xs  text-text-tertiary">
                {"Enter your prompt"}
              </span>
              <div className="flex w-full flex-col justify-between gap-0 rounded-[7px] border border-[#202020]">
                <div className="relative">
                  <textarea
                    name="prompt"
                    className="w-full resize-none overflow-hidden text-[14px] leading-[22px]  border-none bg-transparent px-4 pb-2 pt-3 text-text-sub outline-none"
                    id="voice_general_description"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                  ></textarea>
                </div>
                <span className="rounded-b-[7px] bg-bg-3 px-4 py-1 text-xs text-text-tertiary">
                  {"Describe your AI character."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full py-[10px] pl-6 pr-[3px] max-w-[560px] mt-12 bg-white rounded-full">
          <span className="font-inter font-medium text-sm leading-[18px] text-black ">Careful - you have unsaved changes!</span>
          <button onClick={() => handleSave()} className="flex w-[134px] justify-center mr-4 cursor-pointer bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full text-center text-white px-4 py-1.5 font-normal text-sm border border-white/20">
            {loading ? <Image
              src={"/loading.svg"}
              alt="loading_svg"
              width={24}
              height={24}
            /> : "Save changes"
            }
          </button>
        </div>
      </div>

      <VoiceLibraryModal
        voices={voices}
        isModal={openVoiceLibraryModal}
        toggle={toggleVoiceLibraryModal}
        originalVoice={selectedVoice}
        setVoice={setSelectedVoice}
      />
    </div>
  )
}

export default SettingsPage;