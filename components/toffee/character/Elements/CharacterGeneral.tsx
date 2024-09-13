// Components/CharacterGeneral.tsx  
"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import SelectSharing, { SharingProps } from "./SelectSharing";
import { RiGlobalLine } from "../../icons/GlobalLine";
import { RiLockLine } from "../../icons/Lock";
import { UserFollowingIcon } from "../../icons/ProfileIcons";
import Section from "../../../ui/Section";
import InputField from "../../../ui/InputField";
import { TCategory, TCharacter } from "@/lib/types";
import TextareaBlock from "@/components/ui/TextareaBlock";
interface CharacterGeneralProps {
  initialCharacter: TCharacter;
  onFieldChange: (field: keyof TCharacter, value: any) => void;
  onImageChange: (file: File | null) => void;
}

const CharacterGeneral: React.FC<CharacterGeneralProps> = ({ initialCharacter, onFieldChange, onImageChange }) => {
  const [image, setImage] = useState<string | null>(initialCharacter.image);
  const [name, setName] = useState(initialCharacter.name);
  const [description, setDescription] = useState(initialCharacter.description);
  const [shared, setShared] = useState<'Public' | 'Sharing' | 'Private' | null>(initialCharacter.shared && !initialCharacter.private ? 'Public' : initialCharacter.private ? 'Private' : 'Sharing');
  const [introduction, setIntroduction] = useState(initialCharacter.greeting)
  const [instructions, setInstructions] = useState(initialCharacter.instructions)
  const sharingOptions: SharingProps[] = [
    { value: 'Public', label: 'Public and publicly available', icon: RiGlobalLine },
    { value: 'Sharing', label: 'Shared only with selected users', icon: UserFollowingIcon },
    { value: 'Private', label: 'Private only for myself', icon: RiLockLine },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setImage(tempUrl);
      onImageChange(file);
      e.target.value = "";
    }
  };

  const handleSelectedOptionChange: Dispatch<SetStateAction<'Public' | 'Sharing' | 'Private' | null>> = (value) => {
    setShared(value);
    if (value === 'Public') {
      onFieldChange('shared', true);
      onFieldChange('private', false);
    } else if (value === 'Private') {
      onFieldChange('shared', false);
      onFieldChange('private', true);
    } else {
      onFieldChange('shared', false);
      onFieldChange('private', false);
    }
  };
  useEffect(() => {
    onFieldChange("image", image);
  }, [image, onFieldChange]);

  useEffect(() => {
    onFieldChange("name", name);
  }, [name, onFieldChange]);

  useEffect(() => {
    onFieldChange("description", description);
  }, [description, onFieldChange]);

  useEffect(() => {
    onFieldChange("greeting", introduction);
  }, [introduction, onFieldChange]);

  useEffect(() => {
    onFieldChange("instructions", instructions);
  }, [instructions, onFieldChange]);
  return (
    <div className="flex flex-col w-full max-w-[560px] gap-10 items-start">
      <AvatarSection
        image={image}
        setFile={setImage}
        onFileChange={handleFileChange}
      />
      <Section title="General" className="w-full">
        <InputField
          label="Name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <TextareaBlock
          label="Description"
          name="description"
          value={description}
          onChange={setDescription}
          placeholder="Tips on initiating a conversation with your AI"
        />
        <TextareaBlock
          label="Introduction"
          name="introduction"
          value={introduction}
          onChange={setIntroduction}
          placeholder="Guide your AI on how to initiate the conversation."
        />
        <TextareaBlock
          label="Character Instructions"
          name="instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="Decide on the best way for your AI to initiate the conversation."
        />
        <SelectSharing
          options={sharingOptions}
          selectedOption={shared}
          setSelectedOption={handleSelectedOptionChange}
        />
      </Section>
    </div>
  );
};

interface AvatarSectionProps {
  image: string | null;
  setFile: (fileName: string | null) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ image, setFile, onFileChange }) => (
  <Section className="items-center">
    <label htmlFor="avatar-input" className="flex flex-col h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-full">
      <Image src={image || "/default-character.svg"} alt="Character Image" className="h-[120px] w-[120px] rounded-full object-cover" width={0} height={0} sizes="100vw" />
      <input type="file" id="avatar-input" onChange={onFileChange} accept="image/*" className="hidden" />
    </label>
    <div className="flex flex-col gap-1">
      <span className="text-center text-sm font-medium leading-[18px] text-white">Click on image to replace</span>
      <button className="text-center text-xs font-normal text-[#DF1C41]" onClick={() => setFile(null)}>Delete avatar</button>
    </div>
  </Section>
);

export default CharacterGeneral;  