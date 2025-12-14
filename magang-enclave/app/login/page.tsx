"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    router.push("/beranda");
  };

  return (
    <div className="bg-white relative w-full min-h-screen flex">
      {/* Left side - Decorative background */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 p-6">
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <Image
              src="/login-bg.png"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Logo - Top */}
        <div className="w-full flex justify-center md:justify-end p-6 md:p-8">
          <div className="relative w-32 md:w-48 lg:w-[237px] h-16 md:h-20 lg:h-[85px]">
            <Image
              src="/logo.png"
              alt="Enclave Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 pb-12">
          <div className="w-full max-w-[527px] space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <h1 className="font-semibold text-[#4180a9] text-2xl md:text-3xl lg:text-[36px]">
                Get Started
              </h1>
              <p className="font-normal text-[#424141] text-base md:text-lg">
                Welcome to Enclave E-office
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 lg:space-y-[69px]">
              <div className="space-y-3 md:space-y-[14px]">
                <label className="font-normal text-[#424141] text-base md:text-lg block">
                  Email <span className="text-[#f60707]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 md:h-16 lg:h-[71px] px-4 md:px-6 border border-black rounded-[20px] text-base focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-3 md:space-y-[14px]">
                <label className="font-normal text-[#424141] text-base md:text-lg block">
                  Password <span className="text-[#f60707]">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 md:h-16 lg:h-[71px] px-4 md:px-6 border border-black rounded-[20px] text-base focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 md:h-14 lg:h-[56px] bg-[#4180a9] text-[#f6f7f8] rounded-[30px] font-semibold text-lg md:text-xl lg:text-[24px] hover:bg-[#356890] transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
