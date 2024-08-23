"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
export default function Signup({ isAuth }: { isAuth: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || "/login";

  useEffect(() => {
    if (isAuth) router.push(callbackUrl);
  }, [isAuth, router, callbackUrl]);
  const handleGoogleAuth = async () => {
    const response = await signIn("google", {
      redirect: false,
    })
    if (response?.ok) {
      router.push(callbackUrl)
    } else {
      toast.error("Signup failed.", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setname] = useState("");
  const [errorForEmail, setErrorForEmail] = useState("");
  const [errorForPassword, setErrorForPassword] = useState("");
  const [errorForConfirmPassword, setErrorForConfirmPassword] = useState("");
  const [errorForname, setErrorForname] = useState("");

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setErrorForEmail("Please enter your email address.");
      valid = false;
    } else if (!validateEmailFormat(email)) {
      setErrorForEmail("Please enter a valid email address.");
      valid = false;
    } else {
      setErrorForEmail("");
    }

    if (!password) {
      setErrorForPassword("Password cannot be empty.");
      valid = false;
    } else {
      setErrorForPassword("");
    }

    if (!confirmPassword) {
      setErrorForConfirmPassword("Please confirm your password.");
      valid = false;
    } else if (confirmPassword !== password) {
      setErrorForConfirmPassword("Passwords do not match.");
      valid = false;
    } else {
      setErrorForConfirmPassword("");
    }

    if (!name) {
      setErrorForname("Please enter a name.");
      valid = false;
    } else {
      setErrorForname("");
    }

    return valid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (response.ok) {
      toast.success("Signup successful!", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
      router.push(callbackUrl);
    } else {
      const data = await response.json();
      toast.error(data.message || "Signup failed.", {
        theme: "colored",
        hideProgressBar: true,
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="flex overflow-hidden relative w-full h-full bg-black items-center justify-center">
      <div className="flex flex-col w-[520px] gap-2 rounded-md bg-bg-3">

        <div className="px-10 pt-10 bg-gradient-to-t from-[#BC7F4400] to-[#BC7F4433] rounded-md">
          <Image
            width={29}
            height={29}
            alt="Logo"
            src="/toffee.svg"
            className="inline"
          />
          <h1 className=" text-white text-xl font-semibold leading-7 mt-10">Sign Up</h1>
          <span className=" text-[13px] text-text-tertiary mt-2">Welcome to work full of different characters</span>
        </div>
        <div className="px-10 flex flex-col gap-6 pb-10">
          <div className="bg-white cursor-pointer rounded-full px-4 py-1.5 w-full flex flex-row justify-center gap-1 items-center" onClick={handleGoogleAuth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.1836 10.3638V13.8493H17.1261C16.9091 14.9702 16.2578 15.9193 15.281 16.5575L18.2615 18.8239C19.9981 17.253 20.9999 14.9457 20.9999 12.2048C20.9999 11.5666 20.9415 10.9529 20.8329 10.3639L12.1836 10.3638Z" fill="#4285F4" />
              <path d="M3.98509 7.96655C3.35896 9.17742 3 10.5438 3 12.0002C3 13.4565 3.35896 14.8229 3.98509 16.0338C3.98509 16.0419 7.04082 13.7101 7.04082 13.7101C6.85715 13.1701 6.74858 12.5974 6.74858 12.0001C6.74858 11.4027 6.85715 10.83 7.04082 10.29L3.98509 7.96655Z" fill="#FBBC05" />
              <path d="M12.1838 6.58365C13.5364 6.58365 14.7386 7.04183 15.6987 7.92548L18.3286 5.34823C16.7339 3.89188 14.6635 3 12.1838 3C8.59387 3 5.49649 5.02092 3.98535 7.9664L7.04099 10.2901C7.76729 8.16274 9.79609 6.58365 12.1838 6.58365Z" fill="#EA4335" />
              <path d="M7.03703 13.7131L6.36481 14.2174L3.98535 16.0338C5.49649 18.971 8.59368 21.0002 12.1837 21.0002C14.6632 21.0002 16.742 20.1983 18.2616 18.8238L15.281 16.5574C14.4628 17.0974 13.4192 17.4247 12.1837 17.4247C9.7959 17.4247 7.76719 15.8456 7.04079 13.7183L7.03703 13.7131Z" fill="#34A853" />
            </svg>
            <span className="text-black font-medium text-center  text-sm p-1">Sign up with Google</span>
          </div>
          <div className="flex flex-row w-full gap-[13px] items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="186" height="2" viewBox="0 0 186 2" fill="none">
              <path d="M0 1H186" stroke="url(#paint0_linear_1580_2249)" strokeOpacity="0.1" />
              <defs>
                <linearGradient id="paint0_linear_1580_2249" x1="186" y1="1.00039" x2="93.4769" y2="0.999958" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-text-tertiary text-[13px] ">OR</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="186" height="2" viewBox="0 0 186 2" fill="none">
              <path d="M186 1H-4.35114e-06" stroke="url(#paint0_linear_1580_2251)" strokeOpacity="0.1" />
              <defs>
                <linearGradient id="paint0_linear_1580_2251" x1="1.81322e-09" y1="1.00039" x2="92.5231" y2="0.999958" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <form className="flex flex-col" onSubmit={handleSignup}>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs  text-text-tertiary">Email</label>
              <input type="text" name="email" placeholder="Enter your email" className={`px-4 py-3 rounded-md border bg-transparent text-[13px] focus:outline-none text-white autofill:bg-transparent ${errorForEmail ? "border-[#DF1C41]" : "border-white/10"}`} onChange={(e) => setEmail(e.target.value)} />
              {errorForEmail && (
                <span className="text-[#DF1C41]  text-xs">{errorForEmail}</span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-6">
              <label htmlFor="password" className="text-xs  text-text-tertiary">Password</label>
              <input type="password" name="password" placeholder="Enter your password" className={`px-4 py-3 rounded-md border bg-transparent text-[13px] focus:outline-none text-white ${errorForPassword ? "border-[#DF1C41]" : "border-white/10"}`} onChange={(e) => setPassword(e.target.value)} />
              {errorForPassword && (
                <span className="text-[#DF1C41]  text-xs">{errorForPassword}</span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-6">
              <label htmlFor="confirmPassword" className="text-xs  text-text-tertiary">Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Confirm your password" className={`px-4 py-3 rounded-md border bg-transparent text-[13px] focus:outline-none text-white ${errorForConfirmPassword ? "border-[#DF1C41]" : "border-white/10"}`} onChange={(e) => setConfirmPassword(e.target.value)} />
              {errorForConfirmPassword && (
                <span className="text-[#DF1C41]  text-xs">{errorForConfirmPassword}</span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-6">
              <label htmlFor="name" className="text-xs  text-text-tertiary">Nickname</label>
              <input type="text" name="name" placeholder="Enter your another name" className={`px-4 py-3 rounded-md border bg-transparent text-[13px] focus:outline-none text-white ${errorForname ? "border-[#DF1C41]" : "border-white/10"}`} onChange={(e) => setname(e.target.value)} />
              {errorForname && (
                <span className="text-[#DF1C41]  text-xs">{errorForname}</span>
              )}
            </div>
            <button className="mt-6 bg-gradient-to-r from-[#C28851] to-[#B77536] text-white font-bold text-center cursor-pointer rounded-full px-4 py-2 w-full">
              Sign Up
            </button>
            <Link href="/login" className="text-text-tertiary  text-xs cursor-pointer mt-6">{"Do you have an account?  "} <span className="mt-2 text-[#BC7F44]  text-xs font-medium cursor-pointer">Login</span></Link>
          </form>
        </div>
      </div>
    </div>
  );
}