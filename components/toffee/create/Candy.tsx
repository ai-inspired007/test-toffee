"use client";
import React, { useState } from "react";
import UploadImage from "./Elements/UploadCandyImage";
import UploadFiles from "./Elements/UploadFiles";
import AddText from "./Elements/AddText";
import AddLink from "./Elements/AddLink";
import { X } from 'lucide-react';
import Loading from "../../ui/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiGlobalLine } from "../icons/GlobalLine";
import { RiLockLine } from "../icons/Lock";
import { RiDraftLine } from "../icons/Files";
import SelectSharing, { SharingProps } from "./Elements/SelectSharing";
import AddTheme, {ThemeProps} from "./Elements/AddTheme";

export interface CandyFile {
  name: string;
  file: File | null;
  size: string;
  type: string;
}

export interface CandyText {
  content: string;
}

export interface CandyLink {
  title: string;
  url: string;
  icon: string;
}

const CandyCreate: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [uploadedFiles, setCandyFiles] = useState<CandyFile[] | null>(null);
  const [addedTexts, setTexts] = useState<CandyText[] | null>(null);
  const [addedLinks, setLinks] = useState<CandyLink[] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState("off");
  const [loading, setLoading] = useState(false);
  const defaultTheme: ThemeProps = { id: 1, url: "/theme/default1.svg" };
  const additionalThemes: ThemeProps[] = [{ id: 2, url: "/theme/default2.png" }];
  const [themeFile, setThemeFile] = useState<File | null>(null);

  const [themes, setThemes] = useState<ThemeProps[]>([defaultTheme, ...additionalThemes]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeProps>(defaultTheme);

  const addTheme = (theme: ThemeProps) => {
    setThemes((prevThemes) => [...prevThemes, theme]);
  };

  const deleteTheme = (id: string | number) => {
    if (themes.length > 1 && id !== 1) { // always keep the default theme
      setThemes((prevThemes) => prevThemes.filter(theme => theme.id !== id));
      if (selectedTheme.id === id) {
        setSelectedTheme(defaultTheme);
      } else {
        setSelectedTheme(selectedTheme);
      }
    }
  };

  const validateStep = (step: number) => {
    if (step === 0) {
      if (!name.trim()) {
        toast.error(`Name is required.`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        return false;
      }
      if (!imageURL) {
        toast.error(`Image is required.`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        return false;
      }
    } else if (step === 1) {
      if (!uploadedFiles || uploadedFiles.length === 0) {
        toast.error(`At least one file should be uploaded.`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        return false;
      }
      if (addedTexts && addedTexts.some(text => !text.content.trim())) {
        toast.error(`Empty text boxes are not allowed.`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        return false;
      }
      if (addedLinks && addedLinks.some(link => !link.url.trim() || !link.title.trim())) {
        toast.error(`Complete the link details.`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        return false;
      }
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateStep(0) || !validateStep(1)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      // formData.append('visible', visible);
      formData.append('sharing', selectedOption);
      if (bgFile)
        formData.append('image', bgFile);
      uploadedFiles?.forEach(item => {
        if (item.file)
          formData.append('files', item.file)
      });
      formData.append('texts', JSON.stringify(addedTexts));
      formData.append('links', JSON.stringify(addedLinks));
      formData.append('theme', selectedTheme.url);
      if (themeFile)
        formData.append('themeFile', themeFile)
      
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const response = await fetch('/api/knowledge', {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success("Success creating candy", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
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
  };

  const handleNextStep = (currentStep: number) => {
    if (validateStep(currentStep)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const steps = ["General", "Knowledge", "Theme"];
  const [step, setStep] = useState(0);

  const sharingOptions: SharingProps[] = [
    { value: 'public', label: 'Public and publicly available', icon: RiGlobalLine },
    { value: 'private', label: 'Private only for myself', icon: RiLockLine },
    { value: 'unlisted', label: 'Unlisted', icon: RiDraftLine },
  ];
  const [selectedOption, setSelectedOption] = useState(sharingOptions[0].value);

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      {loading && <Loading />}
      <ToastContainer />
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6" />
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-row rounded-full bg-black p-0.5 text-white gap-0.5">
            {steps.map((item, index) =>
              <div key={index} className={`flex flex-row items-center ${index === step && "bg-[#BC7F44] rounded-full p-0.5"}`}>
                <div className={index < step ? "bg-bg-3 rounded-full w-7 h-7 flex items-center justify-center" : "w-6 h-6 flex items-center justify-center bg-black rounded-full"}>{index + 1}</div>
                {index === step && <div className="text-xs px-2">{item}</div>}
              </div>
            )}
          </div>
        </div>
        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col gap-6 overflow-x-visible">
          {step === 0 && <>
            <div className="w-full text-start text-[32px] font-medium text-white mt-24">
              Create Candy Pack
            </div>
            <UploadImage
              onChange={setImageURL}
              value={imageURL}
              setFile={setBgFile}
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-tertiary">{"Name"}</span>
              <input
                type="text"
                className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-tertiary">{"Description"}</span>
              <textarea name="description" id="" className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <SelectSharing options={sharingOptions} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <div className="w-full bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium border-[1px] border-solid border-white/20 cursor-pointer" onClick={() => handleNextStep(0)}>
              {"Save changes"}
            </div>
          </>}
          {step === 1 && <>
            <div className="w-full text-start text-[32px] font-medium text-white mt-24">
              Add your knowledge
            </div>
            <UploadFiles files={uploadedFiles} setFiles={setCandyFiles} />
            <AddText texts={addedTexts} setTexts={setTexts} />
            <AddLink links={addedLinks} setLinks={setLinks} />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="w-full bg-bg-3 rounded-full px-4 py-1.5 text-center text-sm text-white font-medium border-[1px] border-solid border-white/20 cursor-pointer" onClick={() => setStep(0)}>
                {"Previous step"}
              </div>
              <div className="w-full bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium border-[1px] border-solid border-white/20 cursor-pointer" onClick={() => handleNextStep(1)}>
                {"Continue"}
              </div>
            </div>
          </>}
          {step === 2 && <>
            <div className="w-full text-center mt-12 flex flex-col">
              <span className="text-[32px] font-medium text-white">Add custom themes</span>
              <span className="text-sm text-text-tertiary">You are able to set your custom theme to the chat background</span>
            </div>
            <AddTheme themes={themes} selected={selectedTheme} setSelectedTheme={setSelectedTheme} addTheme={addTheme} deleteTheme={deleteTheme} setThemeFile={setThemeFile} />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="w-full bg-bg-3 rounded-full px-4 py-1.5 text-center text-sm text-white font-medium border-[1px] border-solid border-white/20 cursor-pointer" onClick={() => setStep(1)}>
                {"Previous step"}
              </div>
              <div className="w-full bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium border-[1px] border-solid border-white/20 cursor-pointer" onClick={handleCreate}>
                {"Create Candy"}
              </div>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
};

export default CandyCreate;