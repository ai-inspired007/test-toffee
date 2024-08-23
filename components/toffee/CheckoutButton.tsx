"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getStripe } from "@/lib/stripe/client";
import { toffeePrice as price } from "@/lib/stripe/client";
import { toast } from "react-toastify";
export const CheckOut = ({ redirectPath }: { redirectPath?: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleCheckout = async () => {
    try {
      if (session?.user) {
        const result = await checkoutWithStripe(price, session.user.id, redirectPath);
        // console.log(result)
        if (result) {
          const stripe = await getStripe();
          stripe?.redirectToCheckout({ sessionId: result.sessionId });
        } else {
          toast.error("Subscription failed", { theme: "colored", autoClose: 1500, hideProgressBar: true })
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-full px-4 py-2 bg-gradient-to-r from-[#FDCE48] via-[#EFA732] to-[#FDCE48] rounded-[20px] border border-white/10 justify-center items-center gap-1 inline-flex z-10 cursor-pointer" onClick={handleCheckout}>
      <div className="px-1 py-[3px] justify-center items-center gap-2.5 flex">
        <div className="text-white text-sm font-medium  leading-[18px]">Update to Toffee for $9.99 / month</div>
      </div>
    </div>
  )
}