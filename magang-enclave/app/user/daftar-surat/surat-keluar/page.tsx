"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-user";
import { Menu, Search, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuratKeluarPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("surat-keluar");
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
    { no: 1, namaSurat: "Surat Kerjasama", nomorSurat: "SK/001/XII/2025", pengirim: "Departemen Hubungan Eksternal", penerima: "PT. Digital Indonesia", tanggal: "2025-12-12", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 2, namaSurat: "Surat Undangan Rapat", nomorSurat: "SK/002/XII/2025", pengirim: "Departemen Pengembangan Organisasi", penerima: "Semua Kepala Departemen", tanggal: "2025-12-15", status: "Diproses", statusColor: "#FFBD66" },
    { no: 3, namaSurat: "Surat Pemberitahuan", nomorSurat: "SK/003/XII/2025", pengirim: "Departemen Hubungan Internal", penerima: "Seluruh Anggota", tanggal: "2025-12-18", status: "Selesai", statusColor: "#56F2A7" },
    { no: 4, namaSurat: "Surat Kerjasama Akademik", nomorSurat: "SK/004/XII/2025", pengirim: "Departemen Kelimuan", penerima: "Universitas Indonesia", tanggal: "2025-12-20", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 5, namaSurat: "Surat Penawaran Sponsor", nomorSurat: "SK/005/XII/2025", pengirim: "Departemen Kewirausahaan", penerima: "PT. Tech Innovation", tanggal: "2025-12-22", status: "Diproses", statusColor: "#FFBD66" },
    { no: 6, namaSurat: "Surat Kegiatan Sosial", nomorSurat: "SK/006/XII/2025", pengirim: "Departemen Sosial", penerima: "Dinas Sosial", tanggal: "2025-12-25", status: "Selesai", statusColor: "#56F2A7" },
    { no: 7, namaSurat: "Surat Publikasi", nomorSurat: "SK/007/XII/2025", pengirim: "Departemen Media Informasi", penerima: "Media Partner", tanggal: "2025-12-27", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 8, namaSurat: "Surat Edaran", nomorSurat: "SK/008/XII/2025", pengirim: "Departemen Ketertiban Internal", penerima: "Seluruh Anggota", tanggal: "2025-12-28", status: "Diproses", statusColor: "#FFBD66" },
    { no: 9, namaSurat: "Surat Permohonan Izin", nomorSurat: "SK/009/XII/2025", pengirim: "Departemen Minat Bakat", penerima: "Fakultas", tanggal: "2025-12-29", status: "Selesai", statusColor: "#56F2A7" },
    { no: 10, namaSurat: "Surat Proposal Kegiatan", nomorSurat: "SK/010/XII/2025", pengirim: "Departemen Keprofesian", penerima: "Dekanat", tanggal: "2025-12-30", status: "Menunggu", statusColor: "#D9D9D9" },
    { no: 11, namaSurat: "Surat Peminjaman", nomorSurat: "SK/011/XII/2025", pengirim: "Departemen Keuangan", penerima: "Bank Mandiri", tanggal: "2025-12-28", status: "Diproses", statusColor: "#FFBD66" },
    { no: 12, namaSurat: "Surat Resmi", nomorSurat: "SK/012/XII/2025", pengirim: "Departemen Pengembangan Teknologi & Informasi", penerima: "PT. Software House", tanggal: "2025-12-29", status: "Selesai", statusColor: "#56F2A7" },
    { no: 13, namaSurat: "Surat Undangan Workshop", nomorSurat: "SK/013/XII/2025", pengirim: "Departemen Keprofesian", penerima: "Komunitas Profesional", tanggal: "2025-12-30", status: "Menunggu", statusColor: "#D9D9D9" },
  ];

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    router.push(path);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
  };

  const filteredData = allData.filter(item => {
    const matchSearch = !searchQuery || 
      item.namaSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.tanggal);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchDate = itemDate >= start && itemDate <= end;
    }

    return matchSearch && matchDate;
  });

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
                  placeholder="Cari surat, no surat ..."
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
                      Nama Surat
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Nomer surat
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Pengirim
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Penerima
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-2 text-center">
                      Tanggal
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
                        {row.namaSurat}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.nomorSurat}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.pengirim}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {row.penerima}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-2 text-center text-black">
                        {formatDate(row.tanggal)}
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
