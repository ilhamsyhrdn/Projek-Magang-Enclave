"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-adk";
import { Menu, Search, Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuratMasukPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("surat-masuk");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const tabs = [
    { id: "surat-masuk", label: "Surat Masuk", path: "/adk/daftar-surat/surat-masuk" },
    { id: "surat-keluar", label: "Surat Keluar", path: "/adk/daftar-surat/surat-keluar" },
    { id: "memo", label: "Memo", path: "/adk/daftar-surat/memo" },
    { id: "notulensi", label: "Notulensi", path: "/adk/daftar-surat/notulensi" },
  ];

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    router.push(path);
  };

  const allData = [
    { no: 1, namaSurat: "Surat Kerjasama", nomorSurat: "01/SM/12/2025", pengirim: "PT. Mitra Sejahtera", penerima: "Departemen Hubungan Eksternal", tanggal: "2025-12-12", status: "Ditolak", statusColor: "#EF4444" },
    { no: 2, namaSurat: "Surat Permohonan", nomorSurat: "02/SM/12/2025", pengirim: "Universitas Indonesia", penerima: "Departemen Kelimuan", tanggal: "2025-12-11", status: "Diproses", statusColor: "#FFBD66" },
    { no: 3, namaSurat: "Surat Peminjaman Dana", nomorSurat: "03/SM/12/2025", pengirim: "BEM FT", penerima: "Departemen Keuangan", tanggal: "2025-12-10", status: "Selesai", statusColor: "#56F2A7" },
    { no: 4, namaSurat: "Surat Undangan", nomorSurat: "04/SM/12/2025", pengirim: "Himpunan Mahasiswa", penerima: "Departemen Hubungan Internal", tanggal: "2025-12-09", status: "Ditolak", statusColor: "#EF4444" },
    { no: 5, namaSurat: "Surat Pemberitahuan", nomorSurat: "05/SM/12/2025", pengirim: "Fakultas Teknik", penerima: "Departemen Media Informasi", tanggal: "2025-12-08", status: "Diproses", statusColor: "#FFBD66" },
    { no: 6, namaSurat: "Surat Izin Kegiatan", nomorSurat: "06/SM/12/2025", pengirim: "Dekanat", penerima: "Departemen Pengembangan Organisasi", tanggal: "2025-12-07", status: "Selesai", statusColor: "#56F2A7" },
    { no: 7, namaSurat: "Surat Sponsorship", nomorSurat: "07/SM/12/2025", pengirim: "PT. Tech Innovation", penerima: "Departemen Kewirausahaan", tanggal: "2025-12-06", status: "Ditolak", statusColor: "#EF4444" },
    { no: 8, namaSurat: "Surat Kerjasama Akademik", nomorSurat: "08/SM/12/2025", pengirim: "Institut Teknologi", penerima: "Departemen Keprofesian", tanggal: "2025-12-05", status: "Diproses", statusColor: "#FFBD66" },
    { no: 9, namaSurat: "Surat Permohonan Data", nomorSurat: "09/SM/12/2025", pengirim: "Lembaga Penelitian", penerima: "Departemen Pengembangan Teknologi & Informasi", tanggal: "2025-12-04", status: "Selesai", statusColor: "#56F2A7" },
    { no: 10, namaSurat: "Surat Kegiatan Sosial", nomorSurat: "10/SM/12/2025", pengirim: "PMI Cabang", penerima: "Departemen Sosial", tanggal: "2025-12-03", status: "Ditolak", statusColor: "#EF4444" },
    { no: 11, namaSurat: "Surat Workshop", nomorSurat: "11/SM/12/2025", pengirim: "Komunitas Developer", penerima: "Departemen Minat Bakat", tanggal: "2025-12-02", status: "Diproses", statusColor: "#FFBD66" },
    { no: 12, namaSurat: "Surat Audit Internal", nomorSurat: "12/SM/12/2025", pengirim: "Unit Audit Internal", penerima: "Departemen Ketertiban Internal", tanggal: "2025-12-01", status: "Selesai", statusColor: "#56F2A7" },
    { no: 13, namaSurat: "Surat Pemberitahuan", nomorSurat: "13/SM/12/2025", pengirim: "Rektorat", penerima: "Departemen Hubungan Eksternal", tanggal: "2025-11-30", status: "Ditolak", statusColor: "#EF4444" },
  ];

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

    const matchStatus = statusFilter === "Semua" || item.status === statusFilter;

    return matchSearch && matchDate && matchStatus;
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

              {/* Status Filter Dropdown */}
              <div className="relative min-w-[180px]">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] bg-white flex items-center justify-between"
                >
                  <span className="text-gray-700">{statusFilter}</span>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute top-14 left-0 w-full bg-white rounded-[10px] shadow-lg overflow-hidden z-10 border border-gray-200">
                    <div
                      onClick={() => { setStatusFilter("Semua"); setIsStatusDropdownOpen(false); }}
                      className="font-['Poppins'] text-sm py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Semua
                    </div>
                    <div
                      onClick={() => { setStatusFilter("Ditolak"); setIsStatusDropdownOpen(false); }}
                      className="font-['Poppins'] text-sm py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#EF4444] flex-shrink-0"></span>
                      <span className="text-gray-700">Ditolak</span>
                    </div>
                    <div
                      onClick={() => { setStatusFilter("Diproses"); setIsStatusDropdownOpen(false); }}
                      className="font-['Poppins'] text-sm py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FFBD66] flex-shrink-0"></span>
                      <span className="text-gray-700">Diproses</span>
                    </div>
                    <div
                      onClick={() => { setStatusFilter("Selesai"); setIsStatusDropdownOpen(false); }}
                      className="font-['Poppins'] text-sm py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#56F2A7] flex-shrink-0"></span>
                      <span className="text-gray-700">Selesai</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range Picker */}
              <div className="flex items-center gap-3 border border-gray-300 rounded-[10px] px-4 h-12 bg-white min-w-[300px]">
                <input
                  type="date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min="1900-01-01"
                  max="2999-12-31"
                  className="font-['Poppins'] text-sm text-gray-700 focus:outline-none bg-transparent flex-1"
                />
                <span className="text-gray-400 font-medium">-</span>
                <input
                  type="date" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min="1900-01-01"
                  max="2999-12-31"
                  className="font-['Poppins'] text-sm text-gray-700 focus:outline-none bg-transparent flex-1"
                />
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
                      Nomor surat
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
                      onClick={() => router.push(`/adk/surat-masuk?id=${row.no}`)}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
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
                        <div className="flex items-center justify-center">
                          <span className={
                            row.status === "Ditolak"
                              ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE5E5] text-[#EF4444] text-xs font-medium"
                              : row.status === "Diproses"
                              ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF5E5] text-[#FFBD66] text-xs font-medium"
                              : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5FFF5] text-[#56F2A7] text-xs font-medium"
                          }>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.statusColor }}></span>
                            {row.status}
                          </span>
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




