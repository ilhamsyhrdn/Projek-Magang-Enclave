"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarSuperAdmin({
  isOpen,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear any stored authentication data if needed
    // localStorage.removeItem('auth_token');
    // sessionStorage.clear();
    
    // Navigate to login page
    router.push("/login");
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
                Super Admin +
              </p>
              <p className="font-['Poppins'] font-light text-black text-[8px]">
                Random
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Account */}
          <Link
            href="/dashboard-superAdmin"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg
              font-['Poppins'] text-[14px] transition-all
              ${
                pathname === "/dashboard-superAdmin"
                  ? "bg-[#b8d7e8] text-black font-medium"
                  : "text-[#1E1E1E] hover:bg-gray-100"
              }
            `}
          >
            <LayoutGrid size={20} />
            <span>Account</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 flex-shrink-0 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-lg font-['Poppins'] text-[14px] text-[#1E1E1E] hover:bg-gray-100 transition-all"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
