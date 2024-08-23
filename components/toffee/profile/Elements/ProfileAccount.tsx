"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Subscription, CancelPro } from "./Subscription";
import { Google } from "../../icons/ProfileIcons";
import SelectComponent, { ItemProps } from "./SelectComponent";
import Modal from "../../../ui/Modal";
import { toast } from "react-toastify";
import Section from "../../../ui/Section";
import Spinner from "../../../ui/Spinner";
import InputField from "../../../ui/InputField";
type ProfileAccountProps = {
  userId: string;
  password: string | null;
  isGmail: boolean;
  proCheck: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  customerId?: string | null;
  subscriptionEndDate: string;
  mta: boolean;
};

const ProfileAccount: React.FC<ProfileAccountProps> = ({
  userId,
  password,
  isGmail,
  proCheck,
  setStep,
  customerId,
  subscriptionEndDate,
  mta,
}) => {
  const [oldPassword, setOldPassword] = useState<string | null>("");
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("Under 18 (PG-13)");
  const [errorForPassword, setErrorForPassword] = useState("");
  const [errorForConfirmPassword, setErrorForConfirmPassword] = useState("");
  const [_2faStatus, set2FAStatus] = useState<"enabled" | "disabled" | "initializing">("disabled");
  const [qrData, setQRData] = useState<string>();
  const [qrSecret, setQRSecret] = useState<string>();
  const [userToken, setUserToken] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);  // Loading state  

  const sharingOptions: ItemProps[] = [
    { value: "Under 18 (PG-13)", label: "Under 18 (PG-13)" },
    { value: "18 + (R)", label: "18 + (R)" },
    { value: "? (NC) (no filter)", label: "? (NC) (no filter)" },
  ];

  const validateForm = () => {
    let valid = true;

    if (!oldPassword) {
      setErrorForPassword("Old password cannot be empty.");
      valid = false;
    } else {
      setErrorForPassword("");
    }

    if (!newPassword) {
      setErrorForPassword("New password cannot be empty.");
      valid = false;
    } else {
      setErrorForPassword("");
    }

    if (!confirmPassword) {
      setErrorForConfirmPassword("Please confirm your password.");
      valid = false;
    } else if (confirmPassword !== newPassword) {
      setErrorForConfirmPassword("Passwords do not match.");
      valid = false;
    } else {
      setErrorForConfirmPassword("");
    }

    return valid;
  };

  const onChangePassword = async () => {
    if (!validateForm()) return;

    const data = { oldPassword, newPassword };

    setIsLoading(true);  // Start loading  
    try {
      const response = await fetch(`/api/user/${userId}/pass`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Password updated successfully", {
          theme: "colored",
          hideProgressBar: true,
          autoClose: 1500,
        });
      } else {
        const error = await response.text();
        setErrorText(error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);  // End loading  
    }
  };

  const connectMfa = async () => {
    setIsLoading(true);  // Start loading  
    try {
      set2FAStatus("initializing");
      const response = await fetch("/api/2fa/qrcode");
      const data = await response.json();
      setQRData(data.qrCode);
      setQRSecret(data.secret);
    } catch (error) {
      console.error("Error generating MFA:", error);
      set2FAStatus("disabled");
    } finally {
      setIsLoading(false);  // End loading  
    }
  };

  const disconnectMfa = async () => {
    setIsLoading(true);  // Start loading  
    try {
      const request = { _2faStatus: "disabled", qrSecret: "" };
      const response = await fetch(`/api/user/${userId}/2fa`, {
        method: "POST",
        body: JSON.stringify(request),
      });

      if (response.ok) {
        set2FAStatus("disabled");
        toast.success("Two-factor authentication disabled.", {
          theme: "colored",
          hideProgressBar: true,
          autoClose: 1500,
        });
        setErrorText("");
      } else {
        const error = await response.text();
        toast.error("2FA setting failed", {
          theme: "colored",
          hideProgressBar: true,
          autoClose: 1500,
        });
        setErrorText(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);  // End loading  
    }
  };

  const verifyMfa = async () => {
    if (userToken?.length === 6) {
      setIsLoading(true); // Start loading  
      try {
        const response = await fetch(`/api/2fa/verify?secret=${qrSecret}&token=${userToken}`);
        const result = await response.json();

        if (result.verified) {
          set2FAStatus("enabled");
          const request = { _2faStatus: "enabled", qrSecret };
          const response = await fetch(`/api/user/${userId}/2fa`, {
            method: "POST",
            body: JSON.stringify(request),
          });

          if (response.ok) {
            toast.success("Two-factor authentication enabled.", {
              theme: "colored",
              hideProgressBar: true,
              autoClose: 1500,
            });
            setErrorText("");
          } else {
            const error = await response.text();
            toast.error("2FA setting failed", {
              theme: "colored",
              hideProgressBar: true,
              autoClose: 1500,
            });
            setErrorText(error);
          }
        } else {
          setUserToken("");
          setErrorText("Failed. Please scan the QR code and repeat verification.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);  // End loading  
      }
    } else {
      toast.error("Invalid verification code", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      setErrorText("Invalid verification code");
    }
  };
  const [isCanceled, setIsCanceled] = useState(false);

  const handleCancelSubscriptionSuccess = () => {
    setIsCanceled(true);
  };
  return (
    <div className="relative flex flex-col w-full max-w-[560px] gap-10 items-start">
      {isLoading && <Spinner />}  {/* Conditionally render Spinner */}
      <Section title="Subscription">
        {proCheck && customerId && !isCanceled ? (
          <CancelPro
            customerId={customerId}
            subscriptionEndDate={subscriptionEndDate}
            isLoading={isLoading}
            onCancelSuccess={handleCancelSubscriptionSuccess}
          />
        ) : (
          <Subscription redirectPath={`/profile/${userId}/edit`} />
        )}
      </Section>

      <Section title="Password">
        {isGmail ? (
          <GoogleSignInInfo />
        ) : (
          <PasswordChangeForm
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errorForPassword={errorForPassword}
            errorForConfirmPassword={errorForConfirmPassword}
            onChangePassword={onChangePassword}
            isLoading={isLoading}
          />
        )}
      </Section>

      <Section title="Age filter">
        <SelectComponent
          options={sharingOptions}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          label="Filter"
        />
      </Section>

      <Section title="Security" className="mt-8">
        <SecuritySettings
          mta={mta}
          _2faStatus={_2faStatus}
          connectMfa={connectMfa}
          disconnectMfa={disconnectMfa}
          isLoading={isLoading}
        />
      </Section>

      <TwoFAModal
        isOpen={_2faStatus === "initializing"}
        onClose={() => set2FAStatus("disabled")}
        qrData={qrData}
        qrSecret={qrSecret}
        userToken={userToken}
        setUserToken={setUserToken}
        verifyMfa={verifyMfa}
        isLoading={isLoading}
      />
    </div>
  );
};

const GoogleSignInInfo: React.FC = () => (
  <div className="w-full h-20 rounded-[8px] relative border-white/5 border">
    <div className="w-10 h-10 top-5 left-6 rounded-[40px] absolute bg-[#EA4335]">
      <Google />
    </div>
    <div className="flex flex-col w-[213px] h-[42px] gap-2 left-20 top-5 absolute">
      <span className="font-inter font-medium text-sm leading-[18px] text-text-sub">You signed with Google</span>
      <span className="font-inter font-normal text-xs text-text-tertiary">You can’t change your password here</span>
    </div>
  </div>
);

type PasswordChangeFormProps = {
  oldPassword: string | null;
  setOldPassword: Dispatch<SetStateAction<string | null>>;
  newPassword: string | null;
  setNewPassword: Dispatch<SetStateAction<string | null>>;
  confirmPassword: string | null;
  setConfirmPassword: Dispatch<SetStateAction<string | null>>;
  errorForPassword: string;
  errorForConfirmPassword: string;
  onChangePassword: () => void;
  isLoading: boolean;
};

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  errorForPassword,
  errorForConfirmPassword,
  onChangePassword,
  isLoading,
}) => (
  <>
    <InputField
      label="Old password"
      type="password"
      value={oldPassword || ""}
      onChange={(e) => setOldPassword(e.target.value)}
      error={errorForPassword}
      isLoading={isLoading}
    />
    <InputField
      label="New password"
      type="password"
      value={newPassword || ""}
      onChange={(e) => setNewPassword(e.target.value)}
      error={errorForPassword}
      isLoading={isLoading}
    />
    <InputField
      label="Repeat password"
      type="password"
      value={confirmPassword || ""}
      onChange={(e) => setConfirmPassword(e.target.value)}
      error={errorForConfirmPassword}
      isLoading={isLoading}
    />
    <div
      className={`flex w-[161px] h-[36px] rounded-[20px] border px-4 py-[6px] gap-1 bg-white items-center justify-center ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={!isLoading ? onChangePassword : undefined}
    >
      <span className="font-inter font-medium text-sm leading-[18px] text-black">Change password</span>
    </div>
  </>
);


type SecuritySettingsProps = {
  mta: boolean;
  _2faStatus: "enabled" | "disabled" | "initializing";
  connectMfa: () => void;
  disconnectMfa: () => void;
  isLoading: boolean;
};

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  mta,
  _2faStatus,
  connectMfa,
  disconnectMfa,
  isLoading,
}) => (
  <div className={`w-full border rounded-[8px] h-20 relative ${mta ? "border-white/5" : "bg-bg-3 border-white/5"}`}>
    <div className="flex flex-col gap-2 absolute top-4 left-6 bottom-5">
      <span className="font-inter font-medium text-base leading-5 text-text-sub">Multi-factor authentication</span>
      {mta || _2faStatus === "enabled" ? (
        <span className="font-inter font-normal text-xs text-[#38C793]">Connected</span>
      ) : (
        <span className="font-inter font-normal text-xs text-[#777777]">Disconnected</span>
      )}
    </div>
    <div className={`flex absolute items-center justify-center top-[22px] right-6 rounded-[20px] border px-5 py-[6px] gap-1 ${mta ? "bg-bg-3 border-white/20" : "bg-white border-white/20"}`}>
      <button
        className={`font-inter font-medium text-sm leading-[18px] ${mta ? "text-text-sub" : "text-black"}`}
        onClick={!mta || _2faStatus === "disabled" ? connectMfa : disconnectMfa}
        disabled={isLoading}
      >
        {mta || _2faStatus === "enabled" ? "Disconnect" : "Connect"}
      </button>
    </div>
  </div>
);

type TwoFAModalProps = {
  isOpen: boolean;
  onClose: () => void;
  qrData?: string;
  qrSecret?: string;
  userToken?: string;
  setUserToken: Dispatch<SetStateAction<string | undefined>>;
  verifyMfa: () => void;
  isLoading: boolean;
};

const TwoFAModal: React.FC<TwoFAModalProps> = ({ isOpen, onClose, qrData, qrSecret, userToken, setUserToken, verifyMfa, isLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="bg-bg-3 rounded-xl p-6 flex flex-col sm:max-w-[600px]">
      <h1 className="text-white font-inter font-semibold text-[20px] mt-2">Enable two-factor authentication</h1>
      <p className="text-text-additional font-inter text-sm mt-1">
        Use a phone app like <span className="underline">1Password</span>, <span className="underline">Authy</span>,{" "}
        <span className="underline">Google authenticator</span>, or etc. to get 2FA codes when prompted during sign-in
      </p>
      <div className="flex flex-row mt-6">
        {qrData && <img src={qrData} alt="2FA QR Code" />}
        <div className="flex flex-col ml-6">
          <h2 className="text-white font-inter font-medium">SCAN QR CODE</h2>
          <p className="text-text-additional font-inter text-sm mt-1">
            Use an authenticator app from your phone to scan. If you are unable to scan,{" "}
            <span className="underline">enter this text code instead</span>.
          </p>
          <h2 className="text-white font-inter font-medium mt-4">CODE 2FA (MANUAL ENTRY)</h2>
          <span className="text-text-sub bg-[#777777] p-1 text-center mt-2">{qrSecret}</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        <h2 className="text-white font-inter font-medium">Verify the code from the app</h2>
        <input
          type="text"
          className="rounded-md text-white py-1 px-3 border border-solid text-left bg-transparent border-white/10 mt-1 w-fit"
          placeholder="XXXXXX"
          maxLength={6}
          minLength={6}
          onChange={(e) => setUserToken(e.target.value)}
          value={userToken}
          disabled={isLoading}
        />
      </div>
      <hr className="w-full my-4" />
      <div className="flex flex-row w-full justify-end items-center gap-4">
        <button className="text-text-sub rounded-lg px-4 py-2" type="button" onClick={onClose} disabled={isLoading}>
          Cancel
        </button>
        <button className="text-white bg-[#C28851] rounded-lg px-4 py-2" type="button" onClick={verifyMfa} disabled={isLoading}>
          Continue
        </button>
      </div>
    </div>
  </Modal>
);

export default ProfileAccount;