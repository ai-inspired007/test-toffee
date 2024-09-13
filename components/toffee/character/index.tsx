"use client";
import { useState, useCallback } from "react";
import CharacterGeneral from "./Elements/CharacterGeneral";
import CharacterCategory from "./Elements/CharacterCategory";
import CharacterKnowledge from "./Elements/CharacterKnowledge";
import CharacterVoice from "./Elements/CharacterVoice";
import { TCharacter, TKnowledgePack, TVoice } from "@/lib/types";
import { Tag } from "@prisma/client";
import { toast } from "react-toastify";
import Spinner from "../../ui/Spinner";

type UpdateCharacterPayload = Partial<Omit<TCharacter, 'tags'>> & {
  tags?: string[];
  knowledgePackIds?: string[];
};

interface PageProps {
  character: TCharacter;
  knowledges: TKnowledgePack[];
  categories: { id: string; name: string; tags: Tag[] }[];
  voices: TVoice[];
}

const CharacterPage = ({ character: initCharacter, knowledges, categories, voices }: PageProps) => {
  const steps = ["General", "Voice", "Knowledge"];
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: initCharacter.name,
    image: initCharacter.image,
    imageFile: null as File | null,
    shared: initCharacter.shared,
    private: initCharacter.private,
    description: initCharacter.description,
    greeting: initCharacter.greeting,
    instructions: initCharacter.instructions,
    categoryId: initCharacter.categoryId,
    voiceId: initCharacter.voiceId || null,
    characterKnowledgePacks: initCharacter.characterKnowledgePacks?.map(pack => pack.knowledgePackId) || [],
  });

  const [selectedCategories, setSelectedCategories] = useState(categories);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(initCharacter.tags.map(tag => tag.id)));
  const [categoryId, setCategoryId] = useState<string | undefined>(initCharacter.categoryId);
  const [isLoading, setIsLoading] = useState(false);

  const unsavedChanges = () => {
    const hasGeneralChanges = (
      formData.image !== initCharacter.image ||
      formData.name !== initCharacter.name ||
      formData.shared !== initCharacter.shared ||
      formData.private !== initCharacter.private ||
      formData.description !== initCharacter.description ||
      formData.greeting !== initCharacter.greeting ||
      formData.instructions !== initCharacter.instructions ||
      formData.imageFile !== null ||
      categoryId !== initCharacter.categoryId ||
      formData.voiceId !== initCharacter.voiceId ||
      formData.characterKnowledgePacks.sort().toString() !== (initCharacter.characterKnowledgePacks?.map(pack => pack.knowledgePackId).sort().toString() || '')
    );

    const originalTags = initCharacter.tags.map(tag => tag.id);
    const currentTags = Array.from(selectedTags);
    const hasTagChanges = (
      originalTags.length !== currentTags.length ||
      originalTags.some(tag => !currentTags.includes(tag))
    );

    return hasGeneralChanges || hasTagChanges;
  };

  const getChangedData = (): UpdateCharacterPayload => {
    const changedData: UpdateCharacterPayload = {};

    if (formData.name !== initCharacter.name) changedData.name = formData.name;
    if (formData.imageFile) changedData.image = formData.image;
    if (formData.shared !== initCharacter.shared) changedData.shared = formData.shared;
    if (formData.private !== initCharacter.private) changedData.private = formData.private;
    if (formData.description !== initCharacter.description) changedData.description = formData.description;
    if (formData.greeting !== initCharacter.greeting) changedData.greeting = formData.greeting;
    if (formData.instructions !== initCharacter.instructions) changedData.instructions = formData.instructions;
    if (categoryId !== initCharacter.categoryId) changedData.categoryId = categoryId;
    if (formData.voiceId !== initCharacter.voiceId) changedData.voiceId = formData.voiceId;

    const originalTags = initCharacter.tags.map(tag => tag.id);
    const currentTags = Array.from(selectedTags);

    if (
      originalTags.length !== currentTags.length ||
      originalTags.some(tag => !currentTags.includes(tag))
    ) {
      changedData.tags = currentTags;
    }

    if (formData.characterKnowledgePacks.sort().toString() !== (initCharacter.characterKnowledgePacks?.map(pack => pack.knowledgePackId).sort().toString() || '')) {
      changedData.knowledgePackIds = formData.characterKnowledgePacks;
    }

    return changedData;
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const updateFormData = new FormData();
      if (formData.imageFile) {
        updateFormData.append("avatarFile", formData.imageFile);
      }

      const characterInfo = getChangedData();

      updateFormData.append("characterInfo", JSON.stringify(characterInfo));

      const response = await fetch(`/api/character/${initCharacter.id}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (response.ok) {
        toast.success("Success updating character", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        setFormData({
          ...formData,
          imageFile: null,
        });
      } else {
        const errorText = await response.text();
        toast.error(`Error updating: ${errorText}`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error updating character:", error);
      toast.error("Error updating character", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = useCallback((field: keyof TCharacter, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((file: File | null) => {
    setFormData((prev) => ({ ...prev, imageFile: file }));
  }, []);

  const handleVoiceSelect = (voiceId: string) => {
    setFormData((prev) => ({ ...prev, voiceId }));
  };

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <div className="w-full flex justify-center items-center">
          <div className="rounded-full bg-black p-0.5 text-white items-start gap-1 w-[364px] flex flex-row justify-between">
            {steps.map((item, index) => (
              <div
                key={index}
                className={`flex w-full justify-center items-center cursor-pointer px-3 py-[9px] gap-2 ${index === step ? "rounded-3xl bg-[#121212]" : ""}`}
                onClick={() => setStep(index)}
              >
                <div className={`text-center text-sm font-medium leading-[18px] ${index === step ? "text-white" : "text-[#777777]"}`}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="no-scrollbar flex h-full w-full flex-col mt-16 gap-6 overflow-x-visible items-center justify-center">
          {step === 0 && (
            <>
              <CharacterGeneral
                initialCharacter={initCharacter}
                onFieldChange={handleFieldChange}
                onImageChange={handleImageChange}
              />
              <CharacterCategory
                categories={selectedCategories}
                setCategories={setSelectedCategories}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </>
          )}
          {step === 1 && (
            <CharacterVoice
              imageData={formData.image}
              name={formData.name}
              description={formData.description}
              voices={voices}
              selectedVoiceId={formData.voiceId}
              onSelectVoice={handleVoiceSelect}
              categoryTags={categories.flatMap(category => category.tags.map(tag => tag.name))}
            />
          )}
          {step === 2 && (
            <CharacterKnowledge
              imageData={formData.image}
              name={formData.name}
              description={formData.description}
              knowledges={knowledges}
              selectedKnowledgeIds={formData.characterKnowledgePacks}
              setSelectedKnowledgeIds={(knowledgePackIds) => handleFieldChange('characterKnowledgePacks', knowledgePackIds)}
              categoryTags={categories.find(c => c.id === categoryId)?.tags.map(tag => tag.name) || []}
            />
          )}
        </div>
        {unsavedChanges() && (
          <div className="flex items-center justify-between w-full py-[10px] pl-6 pr-[3px] max-w-[560px] mt-12 bg-white rounded-full">
            <span className="font-medium text-sm leading-[18px] text-black">Careful - you have unsaved changes!</span>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className={`flex justify-center bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-[20px] text-center px-4 py-1.5 gap-2 border border-white/20 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="font-medium text-sm leading-[18px] text-white">Save changes</span>
            </button>
          </div>
        )}
      </div>
      {isLoading && <Spinner />}
    </div>
  );
};

export default CharacterPage;