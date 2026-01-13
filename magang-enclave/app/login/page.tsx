"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     const res = await fetch('/api/auth/me', {
  //       credentials: 'include',
  //     });

  //     if (res.ok) {
  //       const data = await res.json();

  //       if (data.user.role === 'superadmin') {
  //         router.replace('/dashboard-superAdmin');
  //       } else if (data.user.role === 'president') {
  //         router.replace('/beranda-approver');
  //       } else if (data.user.role === 'admin') {
  //         router.replace('/beranda-admin');
  //       } else {
  //         router.replace('/beranda-user');
  //       }
  //     }
  //   };

  //   checkLogin();
  // }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tampilkan error dari server
        setError(data.message || 'Email atau Password yang dimasukan salah, silahkan coba lagi');
        setIsLoading(false);
        return;
      }

      // Login berhasil, redirect sesuai role
      if (data.success && data.redirectTo) {
        router.push(data.redirectTo);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan koneksi, silahkan coba lagi');
      setIsLoading(false);
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#4180a9] text-white rounded-[30px] font-['Poppins'] font-semibold text-lg hover:bg-[#356890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Sign In'}
              </button>

              {/* Lupa Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/lupa-password')}
                  className="font-['Poppins'] text-[#424141] text-sm hover:text-[#4180a9] transition-colors"
                  disabled={isLoading}
                >
                  Lupa password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center font-['Poppins']">
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}