"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getStripe } from "@/lib/stripe/client";
import { Price } from "@/lib/stripe/type";
import { toast } from "react-toastify";
export const CheckOut = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const price: Price = {
    id: "price_1PhpbaL2YTxY1mVTUI9kK88q",
    active: true,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    product_id: "prod_QYxWalD7GSIigv",
    trial_period_days: 0,
    type: "recurring",
    unit_amount: 999
  }
  const handleCheckout = async () => {
    try {
      if (session?.user) {
        const result = await checkoutWithStripe(price, session.user.id);
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
    <div className="w-full px-4 py-2 bg-gradient-to-r from-[#a758f2] via-[#7b19eb] to-[#a33cba] rounded-[20px] border border-white/10 justify-center items-center gap-1 inline-flex z-10 cursor-pointer" onClick={handleCheckout}>
      <div className="px-1 py-[3px] justify-center items-center gap-2.5 flex">
        <div className="text-white text-sm font-medium font-inter leading-[18px]">Update to Toffee+</div>
      </div>
    </div>
  )
}