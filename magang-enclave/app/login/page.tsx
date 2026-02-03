"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { RefreshCw, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { user, isLoading } = useAuth();

  // Generate captcha with more complex characters
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(result);
    setCaptchaInput("");
    return result;
  };

  // Advanced captcha drawing with heavy distortion
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 280;
    const height = 80;

    // Clear and set canvas size
    canvas.width = width;
    canvas.height = height;

    // Complex gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(0.5, '#e0f2fe');
    gradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add random colored background noise
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2 + 0.5;
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add multiple wavy lines as noise
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 150 + 50}, ${Math.random() * 100}, ${Math.random() * 0.5 + 0.2})`;
      ctx.lineWidth = Math.random() * 3 + 1;

      const startY = Math.random() * height;
      ctx.moveTo(0, startY);

      for (let x = 0; x < width; x += 5) {
        const y = startY + Math.sin(x / 10 + Math.random() * 10) * 15;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw text with heavy distortion
    const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'];

    for (let i = 0; i < text.length; i++) {
      ctx.save();

      // Random font
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      const fontSize = Math.random() * 10 + 32; // 32-42px
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.textBaseline = 'middle';

      // Position with overlap
      const x = 20 + i * 40 + Math.random() * 10 - 5;
      const y = height / 2 + Math.random() * 20 - 10;

      // Heavy rotation
      const angle = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4 radians

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Random colors (darker for readability but varied)
      const colors = [
        'rgb(0, 100, 0)',
        'rgb(0, 0, 139)',
        'rgb(139, 0, 0)',
        'rgb(75, 0, 130)',
        'rgb(139, 69, 0)',
        'rgb(0, 128, 128)'
      ];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

      // Add text shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(text[i], 0, 0);

      // Random outline
      if (Math.random() > 0.5) {
        ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.strokeText(text[i], 0, 0);
      }

      ctx.restore();
    }

    // Add strike-through lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 0.4 + 0.3})`;
      ctx.lineWidth = Math.random() * 2 + 1;

      const y = Math.random() * height;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + Math.random() * 20 - 10);
      ctx.stroke();
    }

    // Add more random dots on top
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }

    // Add random arcs/circles
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 0.3})`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 30 + 10,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  };

  // Initialize captcha on mount
  useEffect(() => {
    // Delay slightly to ensure canvas is rendered
    const timer = setTimeout(() => {
      const text = generateCaptcha();
      drawCaptcha(text);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Redraw when captcha text changes
  useEffect(() => {
    if (captchaText) {
      drawCaptcha(captchaText);
    }
  }, [captchaText]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      let redirectPath = '/user/beranda';

      switch (user.role) {
        case 'superadmin':
          redirectPath = '/dashboard-superAdmin';
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

    // Validate captcha
    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError("Captcha tidak sesuai!");
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat login';
      setError(errorMessage);
      generateCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshCaptcha = () => {
    const text = generateCaptcha();
    drawCaptcha(text);
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
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center font-['Poppins']">
                    {error}
                  </p>
                </div>
              )}

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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 px-4 pr-12 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder=""
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center mb-2 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-sm">
                  <canvas
                    ref={canvasRef}
                    width="280"
                    height="80"
                    className="max-w-full h-auto"
                  />
                </div>

                <label className="font-['Poppins'] font-normal text-[#424141] text-base block">
                  Captcha <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="flex-1 h-14 px-4 border border-gray-300 rounded-[10px] text-base font-['Poppins'] focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder=""
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="w-14 h-14 bg-[#4180a9] text-white rounded-[10px] flex items-center justify-center hover:bg-[#356890] transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
