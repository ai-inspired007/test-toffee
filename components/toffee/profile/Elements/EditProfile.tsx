"use client";
import React, { useState } from "react";
// import UploadImage from "./Elements/UploadCandyImage";
import { X } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileImage from "./ProfileImage"
import Image from "next/image";

const EditProfile = ({
  setIsEdit,
  userId,
  nowImage,
  name,
  setName,
  linkedin,
  setLinkedin,
  telegram,
  setTelegram,
  instagram,
  setInstagram,
  twitter,
  setTwitter
}: {
    setIsEdit: (isEdit: boolean) => void;
    userId: string;
    nowImage: string | null | undefined;
    name: string;
    setName: (newName: string) => void;
    linkedin: string;
    setLinkedin: (newName: string) => void;
    telegram: string;
    setTelegram: (newName: string) => void;
    instagram: string;
    setInstagram: (newName: string) => void;
    twitter: string;
    setTwitter: (newName: string) => void;
  }) => {
  const [imageData, setImageData] = useState(nowImage);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      if (name)
        formData.append('name', name);
      if (imgFile)
        formData.append('avatar', imgFile);
      
      setIsLoading(true);
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        body: formData
      });

      setIsLoading(false);
      setIsEdit(false);
      console.log(response)
      if (response.ok) {
        toast.success("Success updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      } else {
        const error = await response.text();
        toast.error(`Error updating user: ${error}`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Error updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <ToastContainer />
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6" onClick={() => setIsEdit(false)} />
        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col gap-6 overflow-x-visible justify-center">
          <div className="w-full text-start text-[32px] font-medium text-white mt-24">
            Edit Profile
          </div>
          <ProfileImage
            value={imageData}
            setValue={setImageData}
            setFile={setImgFile}
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
            <span className="text-xs font-semibold text-text-tertiary">{"Linkedin"}</span>
            <input
              type="text"
              className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Telegram"}</span>
            <input
              type="text"
              className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Instagram"}</span>
            <input
              type="text"
              className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Twitter"}</span>
            <input
              type="text"
              className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>
          <div
            className="flex justify-center w-full bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium border-[1px] border-solid border-white/20 cursor-pointer"
            onClick={() => handleUpdate()}
          >
            {isLoading ?
              <Image
                src={"/loading.svg"}
                alt="loading_svg"
                width={24}
                height={24}
              />
              :
              "Save changes"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;