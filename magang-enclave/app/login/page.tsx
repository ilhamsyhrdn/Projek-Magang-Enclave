"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError("");
    
    // Determine redirect based on email domain
    if (email.endsWith("@superadmin.com")) {
      router.push("/dashboard-superAdmin");
    } else if (email.endsWith("@admin.com")) {
      router.push("/beranda-admin");
    } else if (email === "approver@user.com") {
      // Special case for approver
      router.push("/beranda-approver");
    } else if (email.endsWith("@user.com")) {
      router.push("/beranda-user");
    } else {
      // If email doesn't match any domain, show error message
      setError("Email atau Password yang dimasukan salah, silahkan coba lagi");
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Left side - Building Illustration */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <Image
              src="/login-bg.png"
              alt="Building"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="font-['Poppins'] font-semibold text-[#4180a9] text-3xl md:text-4xl">
                Get Started
              </h1>
              <p className="font-['Poppins'] font-normal text-[#424141] text-base md:text-lg">
                Welcome to Enclave E-office
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-['Poppins'] font-normal text-[#424141] text-base block">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                  placeholder=""
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-['Poppins'] font-normal text-[#424141] text-base block">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                  placeholder=""
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-[#4180a9] text-white rounded-[30px] font-['Poppins'] font-semibold text-lg hover:bg-[#356890] transition-colors"
              >
                Sign In
              </button>

              {/* Lupa Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/lupa-password')}
                  className="font-['Poppins'] text-[#424141] text-sm hover:text-[#4180a9] transition-colors"
                >
                  Lupa password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-600 text-sm text-center font-['Poppins']">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
