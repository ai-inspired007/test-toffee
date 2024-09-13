"use client";
import { useState } from "react";
import { GroupIcon } from "../../icons/Group";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CheckOut } from "../../CheckoutButton";

export const Subscription = ({ redirectPath }: { redirectPath?: string }) => {
  const items = [
    {
      main: "Join the Creator Program",
      sub: "Coming soon, earn real world money from your creations!"
    },
    {
      main: "Unlimited Chatting and Voice Calls",
      sub: "No queues or waiting rooms!"
    },
    {
      main: "No Ads",
      sub: ""
    },
    {
      main: "Faster response times",
      sub: ""
    },
    {
      main: "Early access to new features",
      sub: ""
    },
    {
      main: "? Memories per Query instead of ?.",
      sub: ""
    },
    {
      main: "Enhanced Memory",
      sub: ""
    },
    {
      main: "Make up to ? Candies a month",
      sub: ""
    },
    {
      main: "Create and personalize characters with unlimited Knowledge Packs",
      sub: ""
    },
    {
      main: "Customize Chat UI",
      sub: ""
    },
    {
      main: "Toffee+ Profile Badge",
      sub: ""
    }
  ]
  const [unfold, setUnfold] = useState(false);
  return (
    <div className="w-full flex-col flex justify-center items-center">
      <div className="bg-[#121212] border border-[#FDCE48] rounded-2xl w-[90%] sm:w-[571px] max-h-[80vh] shadow-[0_2px_4px_1px_rgba(0,0,0,0.30)] flex flex-col p-6 sm:p-10 gap-4 sm:gap-8 relative overflow-hidden">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-4">
            <GroupIcon />
            <span className="font-semibold  text-xl text-white">Toffee+</span>
          </div>
          {!unfold && <p className="text-sm  text-[#B1B1B1] leading-snug w-full sm:w-[70%]">This feature available only for the Toffee+ Enhance your current plan to unlock a wider range of features and exclusive privileges.</p>}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-end">
            <span className=" text-[32px] text-[#E69B33] font-semibold">$9.99 / month</span>
            {!unfold && <span className="text-sm text-white  underline mb-2 cursor-pointer z-10" onClick={() => setUnfold(true)}>Read all features</span>}
          </div>
        </div>
        {unfold && <div className="flex flex-col gap-5 w-full h-full overflow-auto no-scrollbar z-20">
          {items.map((item, index) => (
            <div className="flex flex-row gap-4" key={index}>
              <Check className="text-[#777777]" />
              <div className="flex flex-col gap-1">
                <span className="text-white text-sm font-medium ">{item.main}</span>
                <span className="text-[#b1b1b1] text-[13px] ">{item?.sub}</span>
              </div>
            </div>
          ))}
        </div>}
        <CheckOut redirectPath={redirectPath} />
      </div>
    </div>
  )
}
type CancelProProps = {
  customerId: string;
  subscriptionEndDate: string;
  isLoading?: boolean;
  onCancelSuccess: () => void;
};

export const CancelPro: React.FC<CancelProProps> = ({ customerId, subscriptionEndDate, isLoading, onCancelSuccess }) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const handleCancelSubscription = async () => {
    if (isLoading) return;

    try {
      setIsCanceling(true);
      const response = await fetch(`/api/checkout`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      });

      if (response.ok) {
        toast.success("Subscription canceled successfully.", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
        onCancelSuccess();
      } else {
        toast.error("Failed to cancel subscription.", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error canceling subscription", error);
      toast.error("Error canceling subscription.", { theme: "colored", hideProgressBar: true, autoClose: 1500 });
    } finally {
      setIsCanceling(false);
      router.refresh();
    }
  };

  const formattedDate = new Date(subscriptionEndDate).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="w-full h-24 rounded-[8px] border bg-bg-3 border-white/5 relative">
      <div className="flex flex-col gap-2 absolute left-6 top-6">
        <span className=" font-medium text-lg leading-6 tracking-tight text-[#E69B33]">Toffee+</span>
        <span className=" font-normal text-xs text-text-additional">Until {formattedDate}</span>
      </div>
      <button
        className="h-10 absolute top-7 right-6 rounded-[20px] px-4 py-2 gap-1 bg-[#2F2F2F]"
        onClick={handleCancelSubscription}
        disabled={isCanceling || isLoading}
      >
        <span className=" font-medium text-sm leading-[18px] text-text-sub">
          {isCanceling ? "Canceling..." : "Cancel subscription"}
        </span>
      </button>
    </div>
  );
};