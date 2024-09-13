"use client";
import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Category, Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { AddCharacterImage } from "./Elements/Character/AddCharacterImage";
import CharacterInformation from "./Elements/Character/CharacterInformation";
import CharacterConversation, { Conversation } from "./Elements/Character/CharacterConv";
import { CharacterAddons } from "./Elements/Character/CharacterAddons";
import { CharacterPreview } from "./Elements/Character/CharacterPreview";
import SelectGender from "./Elements/Character/SelectGender";
import SelectImageType from "./Elements/Character/ImageType";
import { TKnowledgePack, TVoice } from "@/lib/types";
import CharacterVoice from "./Elements/Character/CharacterVoice";
type GenderType = "Male" | "Female" | "Non-Binary" | "Prefer Not To Answer";
type ImageType = "upload" | "generate" | null;
interface ConversationDetail {
  seed: string;
  name: string;
}

const CharacterCreate = ({
  categorylist,
  addons,
  voices,
  seeds
}: {
  categorylist: { id: string, name: string, tags: Tag[] }[];
  addons: TKnowledgePack[];
  voices: TVoice[];
  seeds: ConversationDetail[];
}) => {
  const steps = ["Image", "General", "Respond", "Voice", "Knowledge", "Preview"];
  const [step, setSlideNumber] = useState(-2);
  const [gender, setGender] = useState<GenderType | null>(null);
  const [imageType, setImageType] = useState<ImageType>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageData, setImageData] = useState<string | null>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<Category["id"] | undefined>(categorylist[0]?.id || undefined);
  const [introduction, setIntroduction] = useState("");
  const [instructions, setInstructions] = useState("");
  const [scenario, setScenario] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const [categories, setCategories] = useState(categorylist);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [categoryTags, setCategoryTags] = useState<Set<string>>(new Set());
  const [selectedAddons, setSelectedAddons] = useState<TKnowledgePack[]>([]);
  const [conversation, setConversation] = useState<Conversation[]>([
    { title: "Conversation", content: [{ question: "", answer: "" }] },
  ]);

  const [importedConv, setImportedConv] = useState<Conversation[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null)
  useEffect(() => {
    if (categoryId) {
      const category = categorylist.find((cat) => cat.id === categoryId);
      setCategoryTags(new Set(category?.tags.map(tag => tag.name)));
    }
  }, [categoryId, categorylist]);

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!imageData) newErrors.imageData = "Image is required.";
        break;
      case 1:
        // Add validation if needed  
        break;
      case 2:
        // Add validation if needed  
        break;
      default:
        return true;
    }

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        toast.error(error as string, {
          theme: "colored",
          hideProgressBar: true,
          autoClose: 1500,
        });
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const advanceStep = () => {
    if (validateStep(step)) {
      setSlideNumber(step + 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (index < step || validateStep(step)) {
      setSlideNumber(index);
    }
  };

  async function createCharacter() {
    const formData = new FormData();
    if (imageFile) formData.append("imgFile", imageFile);
    const conversationString = JSON.stringify(conversation);
    let mainData = {
      name,
      description,
      greeting: introduction,
      instructions,
      seed: conversationString,
      categoryId: categoryId,
      tags: Array.from(selectedTags),
      addons: Array.from(selectedAddons.map((item) => item.id)),
      voiceId: selectedVoiceId
    };
    formData.append("data", JSON.stringify(mainData));
    const response = await fetch("/api/character", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      router.refresh();
      router.push(`/models`);
    } else {
      toast.error("Something went wrong. Please try again.", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    }
  }
  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };

  const [isUploadModal, setUploadModal] = useState(true);

  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full h-full overflow-auto items-center justify-start relative">
        <div className="no-scrollbar flex w-full flex-col gap-6 overflow-auto items-center pb-[95px]">
          <div className="w-full flex sm:justify-center justify-between items-center relative bg-bg-2 mt-6 py-3 px-4">
            {step > -1 && (
              <div className="flex flex-row rounded-full bg-black p-0.5 text-white gap-0.5 sm:mx-auto">
                {steps.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`flex flex-row items-center cursor-pointer text-xs ${index === step && "bg-[#BC7F44]  rounded-full p-0.5"}`}
                  >
                    <div className={index < step ? "bg-bg-3 rounded-full w-7 h-7 flex items-center justify-center" : (index > step ? "text-[#777777] w-6 h-6 flex items-center justify-center" : "w-6 h-6 flex items-center justify-center bg-black rounded-full")}>{index + 1}</div>
                    {index === step && <div className="text-xs font-normal px-2">{item}</div>}
                  </div>
                ))}
              </div>
            )}

            <X
              className="text-icon-3 bg-bg-3 rounded-full p-1 h-8 w-8 cursor-pointer absolute top-3 right-4"
              onClick={() => setUploadModal(true)}
            />
          </div>

          {step === -2 && (
            <SelectGender
              gender={gender}
              setGender={setGender}
              advanceFunction={() => {
                if (gender) setSlideNumber(-1);
              }}
              previousFunction={() => router.push("/create")}
            />
          )}
          {step === -1 && (
            <SelectImageType
              imageType={imageType}
              setImageType={setImageType}
              advanceFunction={() => {
                if (imageType) setSlideNumber(0);
              }}
              previousFunction={() => setSlideNumber(-2)}
            />
          )}
          {step === 0 && (
            <AddCharacterImage
              imageData={imageData}
              imageType={imageType}
              setImageType={setImageType}
              setImageData={setImageData}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              setImageFile={setImageFile}
              advanceFunction={advanceStep}
              previousFunction={() => setSlideNumber(-1)}
            />
          )}
          {step === 1 && (
            <CharacterInformation
              advanceFunction={advanceStep}
              previousFunction={() => setSlideNumber(0)}
              imageData={imageData}
              categories={categories}
              setCategories={setCategories}
              categoryId={categoryId}
              description={description}
              name={name}
              setName={setName}
              selectedTags={selectedTags}
              setSelectedTags={(tags) => setSelectedTags(new Set(tags))}
              setCategoryId={setCategoryId}
              setDescription={setDescription}
              instructions={instructions}
              setInstructions={setInstructions}
              introduction={introduction}
              setIntroduction={setIntroduction}
              scenario={scenario}
              setScenario={setScenario}
            />
          )}
          {step === 2 && (
            <CharacterConversation
              imageData={imageData}
              description={description}
              name={name}
              setName={setName}
              conversation={conversation}
              setConversation={setConversation}
              advanceFunction={() => {
                advanceStep();

              }}
              previousFunction={() => setSlideNumber(1)}
              seeds={seeds}
              importedConversation={importedConv}
              setImportedConversation={setImportedConv}
            />
          )}
          {step === 3 && (
            <CharacterVoice
              description={description}
              imageData={imageData}
              name={name}
              voices={voices || []}
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={handleVoiceSelect}
              advanceFunction={advanceStep}
              previousFunction={() => setSlideNumber(2)}
              categoryTags={Array.from(categoryTags)}
            />
          )}
          {step === 4 && (
            <CharacterAddons
              isSubmitLoading={isSubmitLoading}
              advanceFunction={advanceStep}
              previousFunction={() => setSlideNumber(3)}
              description={description}
              imageData={imageData}
              name={name}
              addons={addons}
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
              categoryTags={Array.from(categoryTags)}
            />
          )}
          {step === 5 && (
            <CharacterPreview
              isSubmitLoading={isSubmitLoading}
              advanceFunction={() => {
                setIsSubmitLoading(true);
                createCharacter();
                setIsSubmitLoading(false);
              }}
              voice={voices.find((voice) => voice.id === selectedVoiceId)}
              previousFunction={() => setSlideNumber(4)}
              description={description}
              imageData={imageData}
              name={name}
              addons={addons}
              introduction={introduction}
              setIntroduction={setIntroduction}
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
              categories={categories}
              setCategoryId={setCategoryId}
              categoryId={categoryId}
              selectedTags={selectedTags}
              setSelectedTags={(tags) => setSelectedTags(new Set(tags))}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreate;