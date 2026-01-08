"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (passwordBaru !== konfirmasiPassword) {
      setError("Password tidak cocok");
      return;
    }

    setShowNotification(true);
    
    // After 2 seconds redirect to login page
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="bg-white relative w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-['Poppins'] font-semibold text-[#4180a9] text-3xl md:text-4xl">
              Atur Ulang Kata Sandi
            </h1>
            <p className="font-['Poppins'] font-normal text-[#424141] text-base">
              Masukan kata sandi baru
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Password Baru <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder=""
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Konfirmasi Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder=""
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-[#4180a9] text-white rounded-[30px] font-['Poppins'] font-semibold text-lg hover:bg-[#356890] transition-colors"
            >
              Reset Password
            </button>

            {/* Error Message */}
            {error && (
              <div className="text-center">
                <p className="text-red-600 text-sm font-['Poppins']">
                  {error}
                </p>
              </div>
            )}

            {/* Success Notification */}
            {showNotification && (
              <div className="text-center">
                <p className="text-green-600 text-sm font-['Poppins']">
                  Password anda telah diperbarui
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
