"use client";

import { useState } from "react";
import { useAuth } from '@/lib/auth-context';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, X, User } from "lucide-react";
import { 
  LayoutDashboard, 
  Mail, 
  Send, 
  FileText, 
  Clipboard,
  List,
  Archive,
  LogOut 
} from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  date: string;
  time: string;
  isRead: boolean;
  status: string;
}

interface SidebarApproverProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications?: Notification[];
  onNotificationClick?: () => void;
}

export default function SidebarApprover({
  isOpen,
  onToggle,
  notifications = [],
  onNotificationClick,
}: SidebarApproverProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [imageError, setImageError] = useState({
    logo: false,
    avatar: false
  });

  const { user, isLoading } = useAuth();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const formatRole = (role: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed z-50
        w-[269px] h-screen bg-white 
        rounded-br-[25px] rounded-tr-[25px] 
        shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)]
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="relative w-full h-[50px]">
            {!imageError.logo ? (
              <Image
                src="/logo.png"
                alt="Enclave Logo"
                fill
                className="object-contain object-left"
                priority
                onError={() => setImageError(prev => ({ ...prev, logo: true }))}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-start">
                <span className="font-['Poppins'] font-bold text-xl text-blue-600">
                  ENCLAVE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="relative px-5 pb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[39px] h-[39px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
              {!imageError.avatar ? (
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  width={39}
                  height={39}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(prev => ({ ...prev, avatar: true }))}
                  unoptimized
                />
              ) : (
                <User size={24} className="text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <p className="font-['Poppins'] font-medium text-gray-400 text-[15px] truncate">
                  Memuat...
                </p>
              ) : (
                <p className="font-['Poppins'] font-medium text-black text-[15px] truncate">
                  {user?.fullName || 'User'}
                </p>
              )}
              
              {isLoading ? (
                <p className="font-['Poppins'] font-light text-gray-400 text-[8px]">
                  Memuat...
                </p>
              ) : (
                <p className="font-['Poppins'] font-light text-black text-[8px]">
                  {formatRole(user?.role || 'guest')}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Bell size={20} className="text-gray-700" />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Beranda */}
          <Link
            href="/approver/beranda"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/beranda" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <LayoutDashboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Beranda
            </span>
          </Link>

          {/* Surat Masuk */}
          <Link
            href="/approver/surat-masuk"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/surat-masuk" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Mail size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Surat Masuk
            </span>
          </Link>

          {/* Surat Keluar */}
          <Link
            href="/approver/surat-keluar"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/surat-keluar" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Send size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Surat Keluar
            </span>
          </Link>

          {/* Memo */}
          <Link
            href="/approver/memo"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/memo" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <FileText size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Memo
            </span>
          </Link>

          {/* Notulensi */}
          <Link
            href="/approver/notulensi"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/notulensi" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Clipboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Notulensi
            </span>
          </Link>

          {/* Daftar Surat */}
          <Link
            href="/approver/daftar-surat/surat-masuk"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/daftar-surat" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <List size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Daftar Surat
            </span>
          </Link>

          {/* Arsip */}
          <Link
            href="/approver/arsip"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/arsip" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Archive size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Arsip
            </span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-4 pb-8 pt-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Log Out
            </span>
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[60] lg:z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsNotificationOpen(false)}
          />
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-['Poppins'] font-semibold text-xl">
                  Notifikasi
                </h2>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          notification.isRead
                            ? "bg-white border-gray-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                        onClick={onNotificationClick}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-['Poppins'] font-medium text-black text-sm">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-['Poppins'] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.date}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-['Poppins'] ${
                              notification.status === "pending"
                                ? "bg-orange-100 text-orange-600"
                                : notification.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {notification.status === "pending"
                              ? "Menunggu"
                              : notification.status === "approved"
                              ? "Disetujui"
                              : "Selesai"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Bell size={48} className="mb-2" />
                    <p className="font-['Poppins']">Tidak ada notifikasi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}