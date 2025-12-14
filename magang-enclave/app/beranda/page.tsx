"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const statsCards = [
    {
      id: 1,
      title: "Total Surat Masuk",
      count: "0/0",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalSuratMasuk.svg",
    },
    {
      id: 2,
      title: "Total Surat Keluar",
      count: "1/3",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalSuratKeluar.svg",
    },
    {
      id: 3,
      title: "Total Memo",
      count: "13/30",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalMemo.svg",
    },
    {
      id: 4,
      title: "Total Notulensi",
      count: "3/9",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/suratNotulensi.svg",
    },
  ];

  const tableData = [
    { status: "Menunggu", color: "#D9D9D9" },
    { status: "Diproses", color: "#FFBD66" },
    { status: "Selesai", color: "#56F2A7" },
    { status: "Menunggu", color: "#D9D9D9" },
    { status: "Diproses", color: "#FFBD66" },
    { status: "Selesai", color: "#56F2A7" },
    { status: "Menunggu", color: "#D9D9D9" },
    { status: "Diproses", color: "#FFBD66" },
    { status: "Selesai", color: "#56F2A7" },
    { status: "Menunggu", color: "#D9D9D9" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Menu Toggle Button */}
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="px-6 lg:px-10 pb-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-[40px]">
              Dashboard
            </h1>
            <p className="font-['Poppins'] font-light text-black text-xl">
              lorem ipsum dolor sit amet
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 border border-black/25 rounded-[10px] bg-white">
            <div className="w-[30px] h-[30px] bg-[#4180A9] rounded-[5px] flex items-center justify-center">
              <Image
                src="/stash_data-date-light.svg"
                alt="Calendar"
                width={20}
                height={20}
              />
            </div>
            <span className="font-['Inter'] text-xs text-black">
              09 Des 25 - 10 Des 25
            </span>
          </div>

          <select className="px-4 py-2 border border-black/25 rounded-[9px] bg-white text-sm">
            <option>Pilih Berdasarkan....</option>
          </select>

          <button className="px-8 py-2 bg-[#4180a9] text-white rounded-[9px] font-['Poppins'] font-medium text-[13px] hover:bg-[#366d8f] transition-colors">
            Terapkan
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsCards.map((card) => (
            <div
              key={card.id}
              className={`relative w-full h-[189px] rounded-[20px] bg-gradient-to-b ${card.bgGradient} p-5`}
            >
              {/* Icon di kiri atas */}
              <div className="w-[50px] h-[50px] mb-4">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={50}
                  height={50}
                />
              </div>
              
              {/* Icon panah di kanan atas */}
              <div className="absolute top-5 right-5">
                <Image
                  src="/vektorPanah.svg"
                  alt="Arrow"
                  width={24}
                  height={24}
                />
              </div>
              
              <h3 className="font-['Poppins'] font-medium text-white text-xl mb-2">
                {card.title}
              </h3>
              <p className="font-['Montserrat'] font-semibold text-white text-[35px]">
                {card.count}
              </p>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[20px] shadow-md p-6">
          <div className="bg-[#2f5f78] rounded-[10px] p-4 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="font-['Poppins'] font-medium text-white text-base">
                Lorep
              </div>
              <div className="font-['Poppins'] font-medium text-white text-base">
                Dolor sit
              </div>
              <div className="font-['Poppins'] font-medium text-white text-base">
                Ipsum Lor
              </div>
              <div className="font-['Poppins'] font-medium text-white text-base">
                Status
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {tableData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100"
              >
                <div className="font-['Poppins'] text-black text-sm">
                  lorem ipsum
                </div>
                <div className="font-['Poppins'] text-black text-sm">
                  lorem ipsum sit
                </div>
                <div className="font-['Poppins'] text-black text-sm">
                  lorem ipsum sit
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span className="font-['Poppins'] text-black text-sm">
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
