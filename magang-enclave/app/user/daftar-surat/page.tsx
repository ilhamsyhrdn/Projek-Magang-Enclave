"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu, Search, ChevronDown } from "lucide-react";

interface SuratData {
  id: number;
  no: number;
  namaSurat: string;
  nomorSurat: string;
  pengirim: string;
  penerima: string;
  tanggal: string;
  status: string;
  statusColor: string;
  kategori: "Surat Masuk" | "Surat Keluar" | "Memo" | "Notulensi";
}

export default function DaftarSuratPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Surat Masuk" | "Surat Keluar" | "Memo" | "Notulensi">("Surat Masuk");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const allSuratData: SuratData[] = [
    // Surat Masuk
    {
      id: 1,
      no: 1,
      namaSurat: "Surat Kerjasama",
      nomorSurat: "01/SM/12/2025",
      pengirim: "PT. Mitra Sejahtera",
      penerima: "Departemen Hubungan Eksternal",
      tanggal: "12 Des 25",
      status: "Ditolak",
      statusColor: "#EF4444",
      kategori: "Surat Masuk"
    },
    {
      id: 2,
      no: 2,
      namaSurat: "Surat Permohonan",
      nomorSurat: "02/SM/12/2025",
      pengirim: "Universitas Indonesia",
      penerima: "Departemen Kelimuan",
      tanggal: "11 Des 25",
      status: "Diproses",
      statusColor: "#F59E0B",
      kategori: "Surat Masuk"
    },
    {
      id: 3,
      no: 3,
      namaSurat: "Surat Peminjaman Dana",
      nomorSurat: "03/SM/12/2025",
      pengirim: "BEM FT",
      penerima: "Departemen Keuangan",
      tanggal: "10 Des 25",
      status: "Selesai",
      statusColor: "#10B981",
      kategori: "Surat Masuk"
    },
    {
      id: 4,
      no: 4,
      namaSurat: "Surat Undangan",
      nomorSurat: "04/SM/12/2025",
      pengirim: "Himpunan Mahasiswa",
      penerima: "Departemen Hubungan Internal",
      tanggal: "9 Des 25",
      status: "Ditolak",
      statusColor: "#EF4444",
      kategori: "Surat Masuk"
    },
    {
      id: 5,
      no: 5,
      namaSurat: "Surat Pemberitahuan",
      nomorSurat: "05/SM/12/2025",
      pengirim: "Fakultas Teknik",
      penerima: "Departemen Media Informasi",
      tanggal: "8 Des 25",
      status: "Diproses",
      statusColor: "#F59E0B",
      kategori: "Surat Masuk"
    },
    {
      id: 6,
      no: 6,
      namaSurat: "Surat Izin Kegiatan",
      nomorSurat: "06/SM/12/2025",
      pengirim: "Dekanat",
      penerima: "Departemen Pengembangan Organisasi",
      tanggal: "7 Des 25",
      status: "Selesai",
      statusColor: "#10B981",
      kategori: "Surat Masuk"
    },
    {
      id: 7,
      no: 7,
      namaSurat: "Surat Sponsorship",
      nomorSurat: "07/SM/12/2025",
      pengirim: "PT. Tech Innovation",
      penerima: "Departemen Kewirausahaan",
      tanggal: "6 Des 25",
      status: "Ditolak",
      statusColor: "#EF4444",
      kategori: "Surat Masuk"
    },
    {
      id: 8,
      no: 8,
      namaSurat: "Surat Kerjasama Akademik",
      nomorSurat: "08/SM/12/2025",
      pengirim: "Institut Teknologi",
      penerima: "Departemen Keprofesian",
      tanggal: "5 Des 25",
      status: "Diproses",
      statusColor: "#F59E0B",
      kategori: "Surat Masuk"
    },
    // Surat Keluar
    {
      id: 1,
      no: 1,
      namaSurat: "Pt Lorem Ipsum",
      nomorSurat: "01/C111/107/11/2025",
      pengirim: "Ahmad Rizki",
      penerima: "BEM Universitas Indonesia",
      tanggal: "03/11/2025",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      kategori: "Surat Keluar"
    },
    {
      id: 2,
      no: 2,
      namaSurat: "Pt Lorem Ipsum",
      nomorSurat: "02/C111/107/11/2025",
      pengirim: "Chandra Wibawa",
      penerima: "BEM Universitas Padjajaran",
      tanggal: "03/11/2025",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      kategori: "Surat Keluar"
    },
    // Memo
    {
      id: 1,
      no: 1,
      namaSurat: "Memo Pengajuan Dana",
      nomorSurat: "01/M111/12/2025",
      pengirim: "Staff Keuangan",
      penerima: "Manager",
      tanggal: "06/12/2025",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      kategori: "Memo"
    },
    // Notulensi
    {
      id: 1,
      no: 1,
      namaSurat: "Rapat Internal iFest",
      nomorSurat: "100/N11/M1/2025",
      pengirim: "Ilhamsyah",
      penerima: "Direktur",
      tanggal: "03/11/2025",
      status: "Selesai",
      statusColor: "#10B981",
      kategori: "Notulensi"
    },
  ];

  const filteredData = allSuratData.filter(item => item.kategori === activeTab);

  const searchedData = filteredData.filter(item => {
    const matchesSearch = item.namaSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.penerima.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const tabs = ["Surat Masuk", "Surat Keluar", "Memo", "Notulensi"] as const;

  const getStatusBadge = (status: string, color: string) => {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
        style={{ backgroundColor: color + '20', color: color }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
        {status}
      </span>
    );
  };

  const handleRowClick = (item: SuratData) => {
    const routeMap = {
      "Surat Masuk": "/user/surat-masuk",
      "Surat Keluar": "/user/surat-keluar",
      "Memo": "/user/memo",
      "Notulensi": "/user/notulensi"
    };

    router.push(`${routeMap[item.kategori]}?id=${item.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header with Menu Button */}
        <div className="bg-gray-50 py-4 px-6 lg:px-10">
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

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-['Poppins'] text-sm pb-3 transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#4180a9] font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />
                )}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari surat, no surat ..."
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[12px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="px-4 h-12 border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[140px] justify-between bg-white"
              >
                <span className="font-['Poppins'] text-sm text-gray-700">
                  {statusFilter}
                </span>
                <ChevronDown size={20} className="text-gray-600" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-[12px] shadow-lg z-10 min-w-[140px] overflow-hidden">
                  {["Semua", "Diproses", "Selesai", "Ditolak"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left font-['Poppins'] text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      {status !== "Semua" && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              status === "Diproses" ? "#F59E0B" :
                              status === "Selesai" ? "#10B981" :
                              status === "Ditolak" ? "#EF4444" : "transparent"
                          }}
                        />
                      )}
                      <span className="text-gray-700">{status}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-3 border border-gray-300 rounded-[10px] px-4 h-12 bg-white min-w-[300px]">
              <input
                type="date"
                min="1900-01-01"
                max="2099-12-31"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="font-['Poppins'] text-sm text-gray-700 focus:outline-none bg-transparent flex-1"
              />
              <span className="text-gray-400 font-medium">-</span>
              <input
                type="date"
                min="1900-01-01"
                max="2099-12-31"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="font-['Poppins'] text-sm text-gray-700 focus:outline-none bg-transparent flex-1"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#205d7d]">
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white rounded-tl-[10px] min-w-[60px]">
                      No
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[150px]">
                      Nama Surat
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[140px]">
                      Nomor Surat
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[180px]">
                      Pengirim
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[200px]">
                      Penerima
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[120px]">
                      Tanggal
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white rounded-tr-[10px] min-w-[120px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchedData.length > 0 ? (
                    searchedData.map((item, index) => (
                      <tr
                        key={`${item.kategori}-${item.id}`}
                        onClick={() => handleRowClick(item)}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                          {item.no}
                        </td>
                        <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                          {item.namaSurat}
                        </td>
                        <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                          {item.nomorSurat}
                        </td>
                        <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                          {item.pengirim}
                        </td>
                        <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                          {item.penerima}
                        </td>
                        <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                          {item.tanggal}
                        </td>
                        <td className="font-['Poppins'] text-sm py-4 px-4">
                          {getStatusBadge(item.status, item.statusColor)}
                        </td>
                      </tr>
                    ))
                  ) : (
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
