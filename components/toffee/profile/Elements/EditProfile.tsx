"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { UserSettings } from "@prisma/client";
import ProfileGeneral from "./ProfileGeneral";
import ProfileAccount from "./ProfileAccount";
import { ProfileConnections } from "./ProfileConnections";
import Spinner from "../../Spinner"; // Assuming you have a Spinner component  

const EditProfile = ({
  userId,
  user,
  subscriptionEndDate
}: {
  userId: string;
  user: Partial<UserSettings | null>;
  subscriptionEndDate: string;
}) => {
  const steps = ["General", "Account", "Connections"];
  const [step, setStep] = useState(0);

  const initialState = {
    avatar: user?.profile_image || null,
    banner: user?.banner_image || null,
    name: user?.name || null,
    email: user?.email || null,
    shared: user?.shared || null,
    language: user?.language || ""
  };

  const [editAvatar, setEditAvatar] = useState(initialState.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editBanner, setEditBanner] = useState(initialState.banner);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [editName, setEditName] = useState(initialState.name);
  const [editEmail, setEditEmail] = useState(initialState.email);
  const [editShared, setEditShared] = useState(initialState.shared);
  const [editLanguage, setEditLanguage] = useState(initialState.language);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const unsavedChanges = () => {
    return (
      editAvatar !== initialState.avatar ||
      editBanner !== initialState.banner ||
      editName !== initialState.name ||
      editEmail !== initialState.email ||
      editShared !== initialState.shared ||
      editLanguage !== initialState.language ||
      avatarFile !== null ||
      bannerFile !== null
    );
  };

  const validateStep = (currentStep: number) => {
    let newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!editName) newErrors.name = "Name is required.";
        if (!editEmail) newErrors.email = "Email is required.";
        if (!editLanguage) newErrors.language = "Language is required.";
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

  const handleUpdate = async () => {
    try {
      // Make sure step 0 is validated before updating  
      if (!validateStep(step)) return;

      const formData = new FormData();

      if (avatarFile) formData.append('avatarFile', avatarFile);
      if (bannerFile) formData.append('bannerFile', bannerFile);

      const userInfo: Partial<typeof initialState> = {};

      if (editAvatar !== initialState.avatar) userInfo.avatar = editAvatar;
      if (editBanner !== initialState.banner) userInfo.banner = editBanner;
      if (editName !== initialState.name) userInfo.name = editName;
      if (editEmail !== initialState.email) userInfo.email = editEmail;
      if (editShared !== initialState.shared) userInfo.shared = editShared;
      if (editLanguage !== initialState.language) userInfo.language = editLanguage;

      formData.append("userInfo", JSON.stringify(userInfo));

      setIsLoading(true);

      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        body: formData
      });

      setIsLoading(false);
      if (response.ok) {
        toast.success("Success updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });

        // Reset states after successful update  
        setEditAvatar(initialState.avatar);
        setAvatarFile(null);
        setEditBanner(initialState.banner);
        setBannerFile(null);
        setEditName(initialState.name);
        setEditEmail(initialState.email);
        setEditShared(initialState.shared);
        setEditLanguage(initialState.language);
      } else {
        const error = await response.text();
        toast.error(`Error updating user: ${error}`, { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6" onClick={() => false} />
        <span className="text-center  text-sm font-normal leading-[18px] absolute top-[68px] right-[28px] text-[#777777]">ESC</span>
        <div className="w-full flex justify-center items-center">
          <div className="rounded-full bg-black p-0.5 text-white items-start gap-1 w-[364px] flex flex-row justify-between">
            {steps.map((item, index) => (
              <div
                key={index}
                className={`flex w-full justify-center items-center cursor-pointer px-3 py-[9px] gap-2 ${index === step ? "rounded-3xl bg-[#121212]" : ""}`}
                onClick={() => setStep(index)}
              >
                <div className={`text-center font-inter text-sm font-medium leading-[18px] ${index === step ? "text-white" : "text-[#777777]"}`}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="no-scrollbar flex h-full w-full max-w-[720px] flex-col mt-16 gap-6 overflow-x-visible items-center justify-center">
          {step === 0 && (
            <ProfileGeneral
              editAvatar={editAvatar}
              setEditAvatar={setEditAvatar}
              editBanner={editBanner}
              setEditBanner={setEditBanner}
              editName={editName}
              setEditName={setEditName}
              editEmail={editEmail}
              setEditEmail={setEditEmail}
              editShared={editShared}
              setEditShared={setEditShared}
              editLanguage={editLanguage}
              setEditLanguage={setEditLanguage}
              setAvatarFile={setAvatarFile}
              setBannerFile={setBannerFile}
              isGmail={user?.password === null}
            />
          )}
          {step === 1 && (
            <ProfileAccount
              userId={userId}
              password={user?.password || null}
              isGmail={user?.password === null}
              setStep={setStep}
              proCheck={user?.plan === "PRO" ? true : false}
              customerId={user?.customerId}
              subscriptionEndDate={subscriptionEndDate}
              mta={user?.mta ? true : false}
            />
          )}
          {step === 2 && <ProfileConnections />}
        </div>
        {unsavedChanges() && (
          <div className="flex items-center justify-between w-full py-[10px] pl-6 pr-[3px] max-w-[560px] mt-12 bg-white rounded-full">
            <span className="font-inter font-medium text-sm leading-[18px] text-black">Careful - you have unsaved changes!</span>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className={`flex justify-center bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-[20px] text-center px-4 py-1.5 gap-2 border border-white/20 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="font-inter font-medium text-sm leading-[18px] text-white">Save changes</span>
            </button>
          </div>
        )}
      </div>
      {isLoading && <Spinner />}
    </div>
  );
};

export default EditProfile;