"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import SelectSharing, { SharingProps } from "./SelectSharing";
import SelectComponent, { ItemProps } from "./SelectComponent";
import { RiGlobalLine } from "../../icons/GlobalLine";
import { RiLockLine } from "../../icons/Lock";
import { Trash2 } from 'lucide-react';
import { UserSettings_shared } from "@prisma/client";
import { UserFollowingIcon } from "../../icons/ProfileIcons";
import { validImageInputTypes } from "@/lib/upload/util";
import Section from "../../Section";
import InputField from "../../InputField";
type ProfileGeneralProps = {
  editAvatar: string | null;
  setEditAvatar: Dispatch<SetStateAction<string | null>>;
  editBanner: string | null;
  setEditBanner: Dispatch<SetStateAction<string | null>>;
  editName: string | null;
  setEditName: Dispatch<SetStateAction<string | null>>;
  editEmail: string | null;
  setEditEmail: Dispatch<SetStateAction<string | null>>;
  editShared: UserSettings_shared | null;
  setEditShared: Dispatch<SetStateAction<UserSettings_shared | null>>;
  editLanguage: string;
  setEditLanguage: Dispatch<SetStateAction<string>>;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
  setBannerFile: Dispatch<SetStateAction<File | null>>;
  isGmail: boolean;
};

const ProfileGeneral: React.FC<ProfileGeneralProps> = ({
  editAvatar,
  setEditAvatar,
  editBanner,
  setEditBanner,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editShared,
  setEditShared,
  editLanguage,
  setEditLanguage,
  setAvatarFile,
  setBannerFile,
  isGmail
}) => {
  const sharingOptions: SharingProps[] = [
    { value: UserSettings_shared.Public, label: 'Public and publicly available', icon: RiGlobalLine },
    { value: UserSettings_shared.Following, label: 'Following only', icon: UserFollowingIcon },
    { value: UserSettings_shared.Private, label: 'Private only for myself', icon: RiLockLine },
  ];

  const languageOptions: ItemProps[] = [
    { value: 'english', label: 'English' },
    { value: 'spain', label: 'Spain' },
    { value: 'france', label: 'France' },
  ];

  const [errorForEmail, setErrorForEmail] = useState<string>("");

  useEffect(() => {
    if (editEmail) {
      setErrorForEmail(validateEmailFormat(editEmail) ? "" : "Please enter a valid email address.");
    }
  }, [editEmail]);

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFile: Dispatch<SetStateAction<string | null>>, setFileState: Dispatch<SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileBlob = file as Blob;
      const tempUrl = URL.createObjectURL(fileBlob);
      setFileState(file);
      setFile(tempUrl);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[560px] gap-10 items-start">
      <AvatarSection
        editAvatar={editAvatar}
        setEditAvatar={setEditAvatar}
        setAvatarFile={setAvatarFile}
        onFileChange={onFileChange}
      />
      <BannerSection
        editBanner={editBanner}
        setEditBanner={setEditBanner}
        setBannerFile={setBannerFile}
        onFileChange={onFileChange}
      />
      <Section title="User" className="w-full">
        <InputField label="Username" value={editName || ""} onChange={(e) => setEditName(e.target.value)} />
        <div className="flex flex-col w-full gap-1">
          <span className="text-xs font-semibold text-text-tertiary">Email</span>
          <input
            type="email"
            className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
            value={editEmail || ""}
            disabled={isGmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          {errorForEmail && <span className="text-[#DF1C41] font-inter text-xs">{errorForEmail}</span>}
        </div>
        <SelectSharing options={sharingOptions} selectedOption={editShared} setSelectedOption={setEditShared} />
      </Section>
      <Section title="Preferences" className="w-full">
        <SelectComponent options={languageOptions} selectedOption={editLanguage} setSelectedOption={setEditLanguage} label="Language" />
      </Section>
    </div>
  );
};

type AvatarSectionProps = {
  editAvatar: string | null;
  setEditAvatar: Dispatch<SetStateAction<string | null>>;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, setFile: Dispatch<SetStateAction<string | null>>, setFileState: Dispatch<SetStateAction<File | null>>) => void;
};

const AvatarSection: React.FC<AvatarSectionProps> = ({ editAvatar, setEditAvatar, setAvatarFile, onFileChange }) => (
  <Section className="items-center">
    <label htmlFor="avatar-input" className="flex flex-col h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-full">
      <Image src={editAvatar || "/system.svg"} alt="Avatar" className="h-[120px] w-[120px] rounded-full object-cover" width={0} height={0} sizes="100vw" />
      <input type="file" id="avatar-input" onChange={e => onFileChange(e, setEditAvatar, setAvatarFile)} accept={validImageInputTypes.join(", ")} className="hidden" />
    </label>
    <div className="flex flex-col gap-1">
      <span className="text-center font-inter text-sm font-medium leading-[18px] text-white">Click on image to replace</span>
      <span className="text-center font-inter text-xs font-normal text-[#777777]">Recommended size 400x400. PNG or JPEG</span>
      <button className="text-center font-inter text-xs font-normal text-[#DF1C41]" onClick={() => setEditAvatar(null)}>Delete avatar</button>
    </div>
  </Section>
);

type BannerSectionProps = {
  editBanner: string | null;
  setEditBanner: Dispatch<SetStateAction<string | null>>;
  setBannerFile: Dispatch<SetStateAction<File | null>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, setFile: Dispatch<SetStateAction<string | null>>, setFileState: Dispatch<SetStateAction<File | null>>) => void;
};

const BannerSection: React.FC<BannerSectionProps> = ({ editBanner, setEditBanner, setBannerFile, onFileChange }) => (
  <Section className="relative items-center">
    <Image src={editBanner || "/banner.svg"} alt="Banner" className="w-full h-[186px] rounded-2xl" width={0} height={0} sizes="100vw" />
    {editBanner ? (
      <div className="absolute top-2 right-2 bg-bg-3 text-icon-3 p-2 rounded-lg cursor-pointer" onClick={() => setEditBanner(null)}>
        <Trash2 className="h-6 w-6" />
      </div>
    ) : (
      <div className="absolute top-0 w-full h-[186px] rounded-2xl flex justify-center">
        <label htmlFor="banner-input" className="w-full cursor-pointer rounded-2xl">
          <div className="flex flex-col w-full h-[140px] absolute">
            <span className="mt-10 text-center font-inter text-base font-medium leading-[20px] text-[#DDDDDD]">Add your quick profile banner with toffee+</span>
            <span className="mt-2 text-center font-inter text-sm font-normal leading-[18px] text-[#777777]">Looks like this author don’t have any characters yet</span>
          </div>
          <input type="file" id="banner-input" onChange={e => onFileChange(e, setEditBanner, setBannerFile)} accept={validImageInputTypes.join(", ")} className="hidden" />
        </label>
        <div className="flex absolute items-center justify-center rounded-[20px] h-[36px] px-4 py-[6px] top-[110px] bg-white">
          <span className="text-center font-inter text-sm font-medium leading-[18px] text-black">Upgrade to toffee+</span>
        </div>
      </div>
    )}
  </Section>
);

export default ProfileGeneral;