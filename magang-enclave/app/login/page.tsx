"use client";

import { useState } from "react";
import Image from "next/image";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context'

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#277ba7]"></div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      let redirectPath = '/user/beranda';

      switch (user.role) {
        case 'superadmin':
          redirectPath = '/dashboard-superadmin';
          break;
        case 'admin':
          redirectPath = '/admin/beranda';
          break;
        case 'approver':
        case 'secretary':
          redirectPath = '/approver/beranda';
          break;
        case 'general':
          redirectPath = '/user/beranda';
          break;
        default:
          redirectPath = '/user/beranda';
          break;
      }
      
      console.log(`[Login Page] User already logged in. Redirecting to ${redirectPath}`);
      router.push(redirectPath);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return null;
  }

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat login';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#4180a9] text-white rounded-[30px] font-['Poppins'] font-semibold text-lg hover:bg-[#356890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Loading...' : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/lupa-password')}
                  className="font-['Poppins'] text-[#424141] text-sm hover:text-[#4180a9] transition-colors"
                  disabled={isSubmitting}
                >
                  Lupa password?
                </button>
              </div>

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