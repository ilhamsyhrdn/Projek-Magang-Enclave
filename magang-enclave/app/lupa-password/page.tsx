"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LupaPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotification(true);
    
    // Simulate email sent, after 2 seconds redirect to reset password page
    setTimeout(() => {
      router.push('/reset-password');
    }, 2000);
  };

  return (
    <div className="bg-white relative w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-['Poppins'] font-semibold text-[#4180a9] text-3xl md:text-4xl">
              Lupa Password
            </h1>
            <p className="font-['Poppins'] font-normal text-[#424141] text-base">
              Masukan email anda untuk mendapatkan
            </p>
            <p className="font-['Poppins'] font-normal text-[#424141] text-base">
              tautan reset email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
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

            <button
              type="submit"
              className="w-full h-14 bg-[#4180a9] text-white rounded-[30px] font-['Poppins'] font-semibold text-lg hover:bg-[#356890] transition-colors"
            >
              Kirim
            </button>

            {/* Notification */}
            {showNotification && (
              <div className="text-center">
                <p className="text-green-600 text-sm font-['Poppins']">
                  Tautan reset email sudah terkirim
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
