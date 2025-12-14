"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Menu } from "lucide-react";

export default function DaftarSuratPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="px-6 lg:px-10 pb-10">
          <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-[40px]">
            Daftar Surat
          </h1>
          <p className="font-['Poppins'] font-light text-black text-xl">
            Halaman untuk mengelola daftar surat
          </p>
        </div>
      </div>
    </div>
  );
}
