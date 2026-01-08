"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
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

interface SidebarUserProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications?: Notification[];
  onNotificationClick?: () => void;
}

export default function SidebarUser({
  isOpen,
  onToggle,
  notifications = [],
  onNotificationClick,
}: SidebarUserProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    router.push("/");
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
            <Image
              src="/logo.png"
              alt="Enclave Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="relative px-5 pb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[39px] h-[39px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={39}
                height={39}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-medium text-black text-[15px] truncate">
                Super User
              </p>
              <p className="font-['Poppins'] font-light text-black text-[8px]">
                sekuruna
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative hover:opacity-70 transition-opacity"
              >
                <Bell size={17} className="text-[#1E1E1E]" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <div className="absolute -top-1 left-[11px] bg-[#ba0808] text-white text-[6px] px-1 rounded-full min-w-[12px] h-[7px] flex items-center justify-center font-['Poppins'] font-medium">
                    {notifications.filter(n => !n.isRead).length}
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute left-0 top-12 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-[60]">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h3 className="font-['Poppins'] font-semibold text-lg text-gray-800">
                      Notifikasi
                    </h3>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notif.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-['Poppins'] font-medium text-sm text-gray-800">
                              {notif.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                notif.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : notif.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {notif.status === 'pending' && 'Menunggu'}
                              {notif.status === 'approved' && 'Disetujui'}
                              {notif.status === 'completed' && 'Selesai'}
                            </span>
                          </div>
                          <p className="font-['Poppins'] text-xs text-gray-600 mb-2">
                            {notif.message}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-['Poppins'] text-xs text-gray-500">
                              {notif.date}
                            </span>
                            <span className="font-['Poppins'] text-xs text-gray-500">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="font-['Poppins'] text-sm text-gray-500">
                          Tidak ada notifikasi
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Beranda */}
          <Link
            href="/beranda-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/beranda-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <LayoutDashboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Beranda
            </span>
          </Link>

          {/* Surat Masuk */}
          <Link
            href="/suratMasuk-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/suratMasuk-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Mail size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Surat Masuk
            </span>
          </Link>

          {/* Surat Keluar */}
          <Link
            href="/suratKeluar-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/suratKeluar-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Send size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Surat Keluar
            </span>
          </Link>

          {/* Memo */}
          <Link
            href="/memo-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/memo-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <FileText size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Memo
            </span>
          </Link>

          {/* Notulensi */}
          <Link
            href="/notulensi-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/notulensi-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Clipboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Notulensi
            </span>
          </Link>

          {/* Daftar Surat */}
          <Link
            href="/daftar-surat-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/daftar-surat-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <List size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Daftar Surat
            </span>
          </Link>

          {/* Arsip */}
          <Link
            href="/arsip-user"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/arsip-user" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
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
    </>
  );
}
