"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function StrukturJabatanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header with Menu Button */}
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 lg:px-10 pb-10">
          {/* Page Title */}
          <div className="mb-6 md:mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px]">
              Struktur Jabatan
            </h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            <div className="w-full flex justify-center items-center">
              <div className="relative w-full max-w-5xl">
                {!imageError ? (
                  <Image
                    src="/strukturJabatan.jpeg"
                    alt="Struktur Jabatan Organisasi"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-lg"
                    priority
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
                    <AlertCircle className="text-red-500 mb-2" size={48} />
                    <p className="text-red-500 font-medium">Gagal memuat gambar struktur jabatan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
