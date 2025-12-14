"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Bell, X } from "lucide-react";
import { 
  LayoutDashboard, 
  Mail, 
  Archive, 
  Database, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDataMasterOpen, setIsDataMasterOpen] = useState(false);

  const dataSubMenu = [
    { id: "divisi", label: "Divisi", path: "/data-master/divisi" },
    { id: "departemen", label: "Departemen", path: "/data-master/departemen" },
    { id: "jabatan", label: "Jabatan/Posisi", path: "/data-master/jabatan" },
    { id: "pegawai", label: "Pegawai", path: "/data-master/pegawai" },
    { id: "kategori", label: "Kategori", path: "/data-master/kategori" },
    { id: "dokumen-template", label: "Dokumen Template", path: "/data-master/dokumen-template" },
  ];

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
                Super Admin
              </p>
              <p className="font-['Poppins'] font-light text-black text-[8px]">
                Kepala Departemen
              </p>
            </div>
            <div className="relative">
              <Bell size={17} className="text-[#1E1E1E]" />
              <div className="absolute -top-1 left-[11px] bg-[#ba0808] text-white text-[6px] px-1 rounded-full min-w-[12px] h-[7px] flex items-center justify-center font-['Poppins'] font-medium">
                99+
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Beranda */}
          <Link
            href="/beranda"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/beranda" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <LayoutDashboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Beranda
            </span>
          </Link>

          {/* Daftar Surat */}
          <Link
            href="/daftar-surat"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${
                pathname === "/daftar-surat"
                  ? "bg-[#bcdff6]"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <Mail size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Daftar Surat
            </span>
          </Link>

          {/* Arsip */}
          <Link
            href="/arsip"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/arsip" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Archive size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Arsip
            </span>
          </Link>

          {/* Data Master */}
          <div>
            <button
              onClick={() => setIsDataMasterOpen(!isDataMasterOpen)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-[10px] transition-colors
                ${
                  pathname.startsWith("/data-master")
                    ? "bg-[#bcdff6]"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Database size={20} className="text-[#1E1E1E] flex-shrink-0" />
                <span className="font-['Poppins'] text-black text-[14px] font-normal">
                  Data Master
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform text-[#1E1E1E] ${
                  isDataMasterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Data Master Sub Menu */}
            {isDataMasterOpen && (
              <div className="mt-2 mb-2 bg-[#E3F2FD] rounded-[10px] py-2 px-1">
                {dataSubMenu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={`
                      w-full block text-left px-4 py-2.5 rounded-[8px] transition-colors
                      ${
                        pathname === item.path
                          ? "bg-[#bcdff6]"
                          : "hover:bg-white/50"
                      }
                    `}
                  >
                    <span className="font-['Poppins'] text-black text-[13px] font-normal">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
