"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, ArrowUpRight, Calendar } from "lucide-react";
import { useRequireAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  useRequireAuth(['admin']);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("Desember");
  const [startDate, setStartDate] = useState("2025-12-09");
  const [endDate, setEndDate] = useState("2025-12-10");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const handleLetterClick = (letterId: number) => {
    // Adjust route based on letter type if needed
    router.push(`/admin/daftar-surat/surat-masuk?id=${letterId}`);
  };

  const notifications = [
    {
      id: 1,
      type: "surat_masuk",
      title: "Surat Masuk Baru",
      message: "Surat Kerjasama Vendor diterima dari Jhon Doe",
      date: "11 Desember 2025",
      time: "10:30",
      isRead: false,
      status: "pending"
    },
    {
      id: 2,
      type: "surat_keluar",
      title: "Surat Keluar Disetujui",
      message: "Surat Permohonan telah disetujui",
      date: "11 Desember 2025",
      time: "09:15",
      isRead: false,
      status: "approved"
    },
    {
      id: 3,
      type: "memo",
      title: "Memo Baru",
      message: "Memo Pengajuan Cuti memerlukan approval",
      date: "10 Desember 2025",
      time: "14:20",
      isRead: true,
      status: "pending"
    },
    {
      id: 4,
      type: "notulensi",
      title: "Notulensi Selesai",
      message: "Notulensi Rapat Evaluasi Q4 telah selesai",
      date: "10 Desember 2025",
      time: "11:45",
      isRead: true,
      status: "completed"
    },
    {
      id: 5,
      type: "download",
      title: "Download Selesai",
      message: "File Surat Kerjasama.pdf berhasil didownload",
      date: "09 Desember 2025",
      time: "16:30",
      isRead: true,
      status: "completed"
    },
    {
      id: 6,
      type: "approval",
      title: "Menunggu Approval",
      message: "Surat Peminjaman Dana memerlukan persetujuan Anda",
      date: "09 Desember 2025",
      time: "13:00",
      isRead: true,
      status: "pending"
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const statsCards = [
    {
      id: 1,
      title: "Total Surat Masuk",
      route: "/admin/daftar-surat/surat-masuk",
      count: "0/0",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalSuratMasuk.svg",
    },
    {
      id: 2,
      title: "Total Surat Keluar",
      route: "/admin/daftar-surat/surat-keluar",
      count: "1/3",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalSuratKeluar.svg",
    },
    {
      id: 3,
      title: "Total Memo",
      route: "/admin/daftar-surat/memo",
      count: "13/30",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalMemo.svg",
    },
    {
      id: 4,
      title: "Total Notulensi",
      route: "/admin/daftar-surat/notulensi",
      count: "3/9",
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/suratNotulensi.svg",
    },
  ];

  const statusSuratData = [
    { label: "Draft", count: 20, color: "#8B7FD8" },
    { label: "Menunggu", count: 10, color: "#FFB3B3" },
    { label: "Disetujui", count: 12, color: "#66D9D9" },
    { label: "Revisi", count: 5, color: "#FFB366" },
    { label: "Ditolak", count: 9, color: "#5B9BD5" },
    { label: "Selesai", count: 15, color: "#70D98C" },
  ];

  const totalSurat = statusSuratData.reduce((sum, item) => sum + item.count, 0);

  const priorityLetters = [
    {
      id: 1,
      date: "11 Desember 2025",
      title: "Surat Kerjasama Vendor",
      nomor: "01/C111/107/11/2025",
      sender: "Jhon doe",
      category: "Internal",
      approver: "Chandra"
    },
    {
      id: 2,
      date: "11 Desember 2025",
      title: "Surat Kerjasama Vendor",
      nomor: "01/C111/107/11/2025",
      sender: "Jhon doe",
      category: "Internal",
      approver: "Chandra"
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        notifications={notifications}
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
            <h1 className="font-['Poppins'] font-semibold text-black text-[32px] leading-tight">
              Beranda
            </h1>
            <p className="font-['Poppins'] font-normal text-black text-lg mt-1">
              Hai, Selamat Datang Super Admin !
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statsCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                className={`relative w-full h-[189px] rounded-[20px] bg-gradient-to-b ${card.bgGradient} p-5 cursor-pointer hover:opacity-90 transition-opacity`}
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
                  <ArrowUpRight size={24} className="text-white" />
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

          {/* Status Surat & Priority Letters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Surat - Pie Chart */}
            <div className="bg-white rounded-[20px] shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Poppins'] font-semibold text-xl text-gray-800">
                  Status Surat
                </h2>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 bg-[#4180a9] text-white rounded-lg text-sm font-['Poppins'] border-none cursor-pointer"
                >
                  <option>Januari</option>
                  <option>Februari</option>
                  <option>Maret</option>
                  <option>April</option>
                  <option>Mei</option>
                  <option>Juni</option>
                  <option>Juli</option>
                  <option>Agustus</option>
                  <option>September</option>
                  <option>Oktober</option>
                  <option>November</option>
                  <option>Desember</option>
                </select>
              </div>

              {/* Enhanced Pie Chart */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-full max-w-[450px]">
                  {/* Left side labels */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-5">
                    {/* Selesai */}
                    <div className="text-left">
                      <p className="font-['Poppins'] text-sm text-gray-700">Selesai</p>
                      <p className="font-['Poppins'] text-base font-bold" style={{ color: "#70D98C" }}>15</p>
                    </div>
                    {/* Ditolak */}
                    <div className="text-left">
                      <p className="font-['Poppins'] text-sm text-gray-700">Ditolak</p>
                      <p className="font-['Poppins'] text-base font-bold" style={{ color: "#5B9BD5" }}>9</p>
                    </div>
                    {/* Revisi */}
                    <div className="text-left">
                      <p className="font-['Poppins'] text-sm text-gray-700">Revisi</p>
                      <p className="font-['Poppins'] text-base font-bold" style={{ color: "#FFB366" }}>5</p>
                    </div>
                  </div>

                  {/* Right side labels */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-5">
                    {/* Draft */}
                    <div className="text-right">
                      <p className="font-['Poppins'] text-sm text-gray-700">Draft</p>
                      <p className="font-['Poppins'] text-base font-bold" style={{ color: "#8B7FD8" }}>20</p>
                    </div>
                    {/* Menunggu */}
                    <div className="text-right">
                      <p className="font-['Poppins'] text-sm text-gray-700">Menunggu</p>
                      <p className="font-['Poppins'] text-base font-bold" style={{ color: "#FFB3B3" }}>10</p>
                    </div>
                    {/* Disetujui */}
                    <div className="text-right">
                      <p className="font-['Poppins'] text-sm text-gray-700">Disetujui</p>
                      <p className="font-['Poppins'] text-base font-bold" style={{ color: "#66D9D9" }}>12</p>
                    </div>
                  </div>

                  {/* Center chart */}
                  <div className="flex items-center justify-center py-2">
                    <div className="relative w-[260px] h-[260px]">
                      <svg viewBox="0 0 280 280" className="w-full h-full">
                        {/* Draw pie slices */}
                        {statusSuratData.map((item, index) => {
                          const percentage = (item.count / totalSurat) * 100;
                          const angle = (percentage / 100) * 360;
                          const prevAngles = statusSuratData
                            .slice(0, index)
                            .reduce((sum, i) => sum + ((i.count / totalSurat) * 360), 0);

                          const startAngle = prevAngles - 90;
                          const endAngle = startAngle + angle;

                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;

                          const outerRadius = 110;
                          const innerRadius = 70;

                          const x1 = 140 + outerRadius * Math.cos(startRad);
                          const y1 = 140 + outerRadius * Math.sin(startRad);
                          const x2 = 140 + outerRadius * Math.cos(endRad);
                          const y2 = 140 + outerRadius * Math.sin(endRad);

                          const x3 = 140 + innerRadius * Math.cos(endRad);
                          const y3 = 140 + innerRadius * Math.sin(endRad);
                          const x4 = 140 + innerRadius * Math.cos(startRad);
                          const y4 = 140 + innerRadius * Math.sin(startRad);

                          const largeArc = angle > 180 ? 1 : 0;

                          const pathData = [
                            `M ${x1} ${y1}`,
                            `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
                            `L ${x3} ${y3}`,
                            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
                            'Z'
                          ].join(' ');

                          return (
                            <g key={item.label}>
                              <path
                                d={pathData}
                                fill={item.color}
                                className="transition-all duration-300 hover:opacity-80"
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {/* Center Total */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="font-['Poppins'] font-bold text-5xl text-gray-900">
                            {totalSurat}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-3 max-w-md mx-auto">
                {/* Left column - 3 items */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#8B7FD8" }}
                  ></div>
                  <span className="font-['Poppins'] text-sm text-gray-700">
                    Draft
                  </span>
                </div>
                {/* Right column - 3 items */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#FFB366" }}
                  ></div>
                  <span className="font-['Poppins'] text-sm text-gray-700">
                    Revisi
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#FFB3B3" }}
                  ></div>
                  <span className="font-['Poppins'] text-sm text-gray-700">
                    Menunggu
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#5B9BD5" }}
                  ></div>
                  <span className="font-['Poppins'] text-sm text-gray-700">
                    Ditolak
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#66D9D9" }}
                  ></div>
                  <span className="font-['Poppins'] text-sm text-gray-700">
                    Disetujui
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#70D98C" }}
                  ></div>
                  <span className="font-['Poppins'] text-sm text-gray-700">
                    Selesai
                  </span>
                </div>
              </div>
            </div>

            {/* Surat Prioritas Tinggi */}
            <div className="bg-white rounded-[20px] shadow-md p-6">
              <h2 className="font-['Poppins'] font-semibold text-xl text-gray-800 mb-6">
                Surat Prioritas Tinggi
              </h2>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {priorityLetters.map((letter) => (
                  <div
                    key={letter.id}
                    onClick={() => handleLetterClick(letter.id)}
                    className="border-l-[6px] border-red-500 bg-white p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-['Poppins'] text-sm text-gray-900">
                        {letter.nomor}
                      </p>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-['Poppins'] font-medium rounded">
                          Tertunda 3 hari
                        </span>
                        <span className="font-['Poppins'] text-sm text-gray-900">
                          {letter.date}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-['Poppins'] font-semibold text-base text-gray-900 mb-2">
                      {letter.title}
                    </h3>
                    <p className="font-['Poppins'] text-sm text-gray-900 mb-3">
                      {letter.sender} | {letter.category}
                    </p>
                    <p className="font-['Poppins'] text-sm text-gray-900">
                      Approver : {letter.approver}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
