// app/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Ambil email dan tenant dari URL params
    const emailParam = searchParams.get('email');
    const tenantParam = searchParams.get('tenant');
    
    if (emailParam) setEmail(emailParam);
    if (tenantParam) setTenantName(tenantParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validasi password match
    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    // Validasi panjang password
    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetCode,
          newPassword,
          tenantName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setSuccess(true);
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
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
              Masukkan kode yang dikirim ke email Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Email
              </label>
              <input
                type="email"
                value={email}
                className="w-full h-14 px-4 border border-gray-200 bg-gray-50 rounded-[10px] text-base font-['Poppins'] cursor-not-allowed"
                disabled
              />
            </div>

            {/* Kode Reset */}
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Kode Reset <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] text-center tracking-widest text-2xl font-semibold focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder="000000"
                maxLength={6}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 font-['Poppins'] text-center">
                Masukkan kode 6 digit yang dikirim ke email Anda
              </p>
            </div>

            {/* Password Baru */}
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Password Baru <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder="Minimal 6 karakter"
                required
                disabled={isLoading}
              />
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Konfirmasi Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder="Ulangi password baru"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#4180a9] text-white rounded-[30px] font-['Poppins'] font-semibold text-lg hover:bg-[#356890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-600 text-sm font-['Poppins']">{error}</p>
              </div>
            )}

            {/* Success Notification */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-green-600 text-sm font-['Poppins'] font-semibold">
                    Password berhasil diperbarui!
                  </p>
                  <p className="text-green-600 text-xs font-['Poppins'] mt-1">
                    Mengalihkan ke halaman login...
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => router.push('/lupa-password')}
                className="font-['Poppins'] text-[#424141] text-sm hover:text-[#4180a9] transition-colors block w-full"
                disabled={isLoading}
              >
                Belum menerima kode? Kirim ulang
              </button>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-['Poppins'] text-[#424141] text-sm hover:text-[#4180a9] transition-colors"
                disabled={isLoading}
              >
                Kembali ke Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[#4180a9]" size={40} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}