"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotulensiPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("notulensi");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const tabs = [
    { id: "surat-masuk", label: "Surat Masuk", path: "/daftar-surat-admin/suratMasuk" },
    { id: "surat-keluar", label: "Surat Keluar", path: "/daftar-surat-admin/suratKeluar" },
    { id: "memo", label: "Memo", path: "/daftar-surat-admin/memo" },
    { id: "notulensi", label: "Notulensi", path: "/daftar-surat-admin/notulensi" },
  ];

  const allData = [
    { no: 1, noNotulensi: "N-001/2025", tanggalNotulensi: "2025-12-12", judulNotulensi: "Rapat Evaluasi Program Kerja", divisi: "Dept. Pengembangan Organisasi", pembuat: "Ahmad Rizki", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 2, noNotulensi: "N-002/2025", tanggalNotulensi: "2025-12-13", judulNotulensi: "Meeting Kerjasama Eksternal", divisi: "Dept. Hubungan Eksternal", pembuat: "Siti Nurhaliza", status: "Diproses", statusColor: "#FFBD66" },
    { no: 3, noNotulensi: "N-003/2025", tanggalNotulensi: "2025-12-14", judulNotulensi: "Koordinasi Departemen IT", divisi: "Dept. Pengembangan Teknologi & Informasi", pembuat: "Arief Rahman", status: "Selesai", statusColor: "#56F2A7" },
    { no: 4, noNotulensi: "N-004/2025", tanggalNotulensi: "2025-12-15", judulNotulensi: "Perencanaan Kegiatan 2026", divisi: "Dept. Pengembangan Organisasi", pembuat: "Andi Pratama", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 5, noNotulensi: "N-005/2025", tanggalNotulensi: "2025-12-16", judulNotulensi: "Presentasi Proposal Sponsorship", divisi: "Dept. Kewirausahaan", pembuat: "Dewi Lestari", status: "Diproses", statusColor: "#FFBD66" },
    { no: 6, noNotulensi: "N-006/2025", tanggalNotulensi: "2025-12-17", judulNotulensi: "Review Kinerja Departemen", divisi: "Dept. Pengembangan Organisasi", pembuat: "Budi Santoso", status: "Selesai", statusColor: "#56F2A7" },
    { no: 7, noNotulensi: "N-007/2025", tanggalNotulensi: "2025-12-18", judulNotulensi: "Review Budget Keuangan", divisi: "Dept. Keuangan", pembuat: "Bambang Setiawan", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 8, noNotulensi: "N-008/2025", tanggalNotulensi: "2025-12-19", judulNotulensi: "Diskusi Kerjasama Partnership", divisi: "Dept. Hubungan Eksternal", pembuat: "Maya Indah", status: "Diproses", statusColor: "#FFBD66" },
    { no: 9, noNotulensi: "N-009/2025", tanggalNotulensi: "2025-12-20", judulNotulensi: "Program Pelatihan Minat Bakat", divisi: "Dept. Minat Bakat", pembuat: "Sari Wulandari", status: "Selesai", statusColor: "#56F2A7" },
    { no: 10, noNotulensi: "N-010/2025", tanggalNotulensi: "2025-12-21", judulNotulensi: "Pengembangan Kompetensi", divisi: "Dept. Keprofesian", pembuat: "Lina Kusuma", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 11, noNotulensi: "N-011/2025", tanggalNotulensi: "2025-12-22", judulNotulensi: "Koordinasi Kegiatan Sosial", divisi: "Dept. Sosial", pembuat: "Rudi Hartono", status: "Diproses", statusColor: "#FFBD66" },
    { no: 12, noNotulensi: "N-012/2025", tanggalNotulensi: "2025-12-23", judulNotulensi: "Strategi Publikasi Media", divisi: "Dept. Media Informasi", pembuat: "Dina Marlina", status: "Selesai", statusColor: "#56F2A7" },
    { no: 13, noNotulensi: "N-013/2025", tanggalNotulensi: "2025-12-24", judulNotulensi: "Penutupan Semester", divisi: "Dept. Pengembangan Organisasi", pembuat: "Fajar Nugroho", status: "Menunggu", statusColor: "#D9D9D9" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
  };

  const filteredData = allData.filter(item => {
    const matchSearch = !searchQuery || 
      item.noNotulensi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.judulNotulensi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.divisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pembuat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.tanggalNotulensi);
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
                  placeholder="Cari notulensi, no notulensi ..."
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
                      No Notulensi
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Tanggal Notulensi
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Judul Notulensi
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Divisi
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Pembuat
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
                        {row.noNotulensi}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {formatDate(row.tanggalNotulensi)}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.judulNotulensi}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.divisi}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.pembuat}
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
