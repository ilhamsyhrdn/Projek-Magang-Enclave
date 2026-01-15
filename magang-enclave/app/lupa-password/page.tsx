// app/lupa-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function LupaPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tenantName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setSuccess(true);
      
      // Redirect ke halaman reset password setelah 2 detik
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&tenant=${encodeURIComponent(tenantName)}`);
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
              Lupa Password
            </h1>
            <p className="font-['Poppins'] font-normal text-[#424141] text-base">
              Masukkan email Anda untuk mendapatkan kode reset password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Nama Perusahaan <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder="Contoh: enclave"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="font-['Poppins'] font-normal text-[#424141] text-sm block">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                placeholder="nama@email.com"
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
                  Mengirim...
                </>
              ) : (
                'Kirim Kode Reset'
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
                    Kode reset telah dikirim!
                  </p>
                  <p className="text-green-600 text-xs font-['Poppins'] mt-1">
                    Silakan cek email Anda. Mengalihkan ke halaman reset...
                  </p>
                </div>
              </div>
            )}

            <div className="text-center">
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