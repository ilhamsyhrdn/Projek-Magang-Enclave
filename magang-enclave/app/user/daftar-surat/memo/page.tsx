"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-user";
import { Menu, Search, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MemoPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("memo");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const tabs = [
    { id: "surat-masuk", label: "Surat Masuk", path: "/user/daftar-surat/surat-masuk" },
    { id: "surat-keluar", label: "Surat Keluar", path: "/user/daftar-surat/surat-keluar" },
    { id: "memo", label: "Memo", path: "/user/daftar-surat/memo" },
    { id: "notulensi", label: "Notulensi", path: "/user/daftar-surat/notulensi" },
  ];

  const allData = [
    { no: 1, noMemo: "M-001/2025", tanggalMemo: "2025-12-12", kategori: "Internal", tujuan: "Dept. Pengembangan Organisasi", tanggalSelesai: "2025-12-15", perihal: "Rapat Koordinasi", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 2, noMemo: "M-002/2025", tanggalMemo: "2025-12-13", kategori: "Internal", tujuan: "Dept. Keuangan", tanggalSelesai: "2025-12-20", perihal: "Laporan Keuangan Bulanan", status: "Diproses", statusColor: "#FFBD66" },
    { no: 3, noMemo: "M-003/2025", tanggalMemo: "2025-12-14", kategori: "Internal", tujuan: "Dept. Pengembangan Teknologi & Informasi", tanggalSelesai: "2025-12-18", perihal: "Update Website", status: "Selesai", statusColor: "#56F2A7" },
    { no: 4, noMemo: "M-004/2025", tanggalMemo: "2025-12-15", kategori: "Internal", tujuan: "Dept. Hubungan Internal", tanggalSelesai: "2025-12-22", perihal: "Koordinasi Antar Departemen", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 5, noMemo: "M-005/2025", tanggalMemo: "2025-12-16", kategori: "Eksternal", tujuan: "Dept. Media Informasi", tanggalSelesai: "2025-12-25", perihal: "Publikasi Kegiatan", status: "Diproses", statusColor: "#FFBD66" },
    { no: 6, noMemo: "M-006/2025", tanggalMemo: "2025-12-17", kategori: "Internal", tujuan: "Dept. Ketertiban Internal", tanggalSelesai: "2025-12-23", perihal: "Evaluasi Kedisiplinan", status: "Selesai", statusColor: "#56F2A7" },
    { no: 7, noMemo: "M-007/2025", tanggalMemo: "2025-12-18", kategori: "Eksternal", tujuan: "Dept. Hubungan Eksternal", tanggalSelesai: "2025-12-26", perihal: "Kerjasama Instansi", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 8, noMemo: "M-008/2025", tanggalMemo: "2025-12-19", kategori: "Internal", tujuan: "Dept. Kewirausahaan", tanggalSelesai: "2025-12-28", perihal: "Program Business Plan", status: "Diproses", statusColor: "#FFBD66" },
    { no: 9, noMemo: "M-009/2025", tanggalMemo: "2025-12-20", kategori: "Internal", tujuan: "Dept. Sosial", tanggalSelesai: "2025-12-27", perihal: "Kegiatan Bakti Sosial", status: "Selesai", statusColor: "#56F2A7" },
    { no: 10, noMemo: "M-010/2025", tanggalMemo: "2025-12-21", kategori: "Internal", tujuan: "Dept. Minat Bakat", tanggalSelesai: "2025-12-29", perihal: "Workshop & Pelatihan", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 11, noMemo: "M-011/2025", tanggalMemo: "2025-12-22", kategori: "Internal", tujuan: "Dept. Keprofesian", tanggalSelesai: "2025-12-30", perihal: "Sertifikasi Anggota", status: "Diproses", statusColor: "#FFBD66" },
    { no: 12, noMemo: "M-012/2025", tanggalMemo: "2025-12-23", kategori: "Internal", tujuan: "Dept. Kelimuan", tanggalSelesai: "2025-12-31", perihal: "Seminar Akademik", status: "Selesai", statusColor: "#56F2A7" },
    { no: 13, noMemo: "M-013/2025", tanggalMemo: "2025-12-24", kategori: "Internal", tujuan: "Dept. Pengembangan Organisasi", tanggalSelesai: "2026-01-02", perihal: "Evaluasi Program Kerja", status: "Menunggu", statusColor: "#D9D9D9" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
  };

  const filteredData = allData.filter(item => {
    const matchSearch = !searchQuery || 
      item.noMemo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tujuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.tanggalMemo);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchDate = itemDate >= start && itemDate <= end;
    }

    return matchSearch && matchDate;
  });

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    router.push(path);
  };

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
              Daftar Surat
            </h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Tabs */}
            <div className="flex gap-4 md:gap-8 mb-6 border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id, tab.path)}
                  className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-[#4180a9] font-semibold border-b-2 border-[#4180a9]"
                      : "text-gray-500 font-normal"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Date Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari memo, no memo ..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>

              {/* Date Range Picker */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-[10px] px-4 h-12 bg-white min-w-[280px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="font-['Poppins'] text-sm focus:outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="font-['Poppins'] text-sm focus:outline-none"
                />
                <Calendar size={20} className="text-gray-400 flex-shrink-0" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#205d7d] text-white">
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center rounded-tl-[10px] w-12">
                      No
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      No Memo
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Tanggal Memo
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Kategori
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Tujuan
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Perihal
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center rounded-tr-[10px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? filteredData.map((row, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.no}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.noMemo}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {formatDate(row.tanggalMemo)}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.kategori}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.tujuan}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.perihal}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: row.statusColor }}
                          />
                          <span className="text-black">{row.status}</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center font-['Poppins'] text-sm text-gray-500">
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
