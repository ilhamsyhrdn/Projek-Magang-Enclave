"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Calendar, Download, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuratKeluarData {
  no: number;
  namaSurat: string;
  nomorSurat: string;
  pengirim: string;
  penerima: string;
  tanggal: string;
}

export default function ArsipSuratKeluarPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("surat-keluar");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const tabs = [
    { id: "surat-masuk", label: "Surat Masuk", path: "/admin/arsip/surat-masuk" },
    { id: "surat-keluar", label: "Surat Keluar", path: "/admin/arsip/surat-keluar" },
    { id: "memo", label: "Memo", path: "/admin/arsip/memo" },
    { id: "notulensi", label: "Notulensi", path: "/admin/arsip/notulensi" },
  ];

  const allData: SuratKeluarData[] = [
    { no: 1, namaSurat: "Surat Undangan Rapat", nomorSurat: "01/SK/11/2025", pengirim: "Ketua Umum", penerima: "Seluruh Pengurus", tanggal: "2025-11-15" },
    { no: 2, namaSurat: "Surat Permohonan Sponsorship", nomorSurat: "02/SK/11/2025", pengirim: "Dept. Kewirausahaan", penerima: "PT. Digital Solutions", tanggal: "2025-11-12" },
    { no: 3, namaSurat: "Surat Kerjasama", nomorSurat: "03/SK/10/2025", pengirim: "Dept. Hubungan Eksternal", penerima: "Universitas Padjajaran", tanggal: "2025-10-22" },
    { no: 4, namaSurat: "Surat Pemberitahuan Kegiatan", nomorSurat: "04/SK/10/2025", pengirim: "Dept. Media Informasi", penerima: "Fakultas Teknik", tanggal: "2025-10-18" },
    { no: 5, namaSurat: "Surat Permohonan Izin", nomorSurat: "05/SK/09/2025", pengirim: "Dept. Pengembangan Organisasi", penerima: "Dekanat FT", tanggal: "2025-09-20" },
    { no: 6, namaSurat: "Surat Undangan Seminar", nomorSurat: "06/SK/09/2025", pengirim: "Dept. Keilmuan", penerima: "Mahasiswa Teknik", tanggal: "2025-09-15" },
    { no: 7, namaSurat: "Surat Penawaran Kerjasama", nomorSurat: "07/SK/08/2025", pengirim: "Dept. Kewirausahaan", penerima: "PT. Startup Indonesia", tanggal: "2025-08-10" },
    { no: 8, namaSurat: "Surat Peminjaman Tempat", nomorSurat: "08/SK/08/2025", pengirim: "Dept. Hubungan Internal", penerima: "Gedung Serbaguna", tanggal: "2025-08-05" },
    { no: 9, namaSurat: "Surat Kegiatan Bakti Sosial", nomorSurat: "09/SK/07/2025", pengirim: "Dept. Sosial", penerima: "Desa Binaan", tanggal: "2025-07-20" },
    { no: 10, namaSurat: "Surat Permohonan Dana", nomorSurat: "10/SK/07/2025", pengirim: "Dept. Keuangan", penerima: "Sponsor Event", tanggal: "2025-07-12" },
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
      item.penerima.toLowerCase().includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.tanggal);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchDate = itemDate >= start && itemDate <= end;
    }

    return matchSearch && matchDate;
  });

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..";
    }
    return text;
  };

  const handleTextClick = (fullText: string, event: React.MouseEvent<HTMLSpanElement>) => {
    if (fullText.length > 30) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setTooltipContent(fullText);
    }
  };

  const closeTooltip = () => {
    setTooltipContent(null);
    setTooltipPosition(null);
  };

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    router.push(path);
  };

  const handleDownload = (row: SuratKeluarData) => {
    alert(`Download surat ${row.nomorSurat}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200">
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="px-6 lg:px-10 pb-10">
          <div className="mb-6 md:mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px]">Arsip</h1>
          </div>

          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            <div className="flex gap-4 md:gap-8 mb-6 border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id, tab.path)}
                  className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors relative ${
                    activeTab === tab.id ? "text-[#4180a9] font-semibold" : "text-gray-500 font-normal hover:text-gray-700"
                  }`}>
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari surat, no surat, pengirim, penerima ..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>
              <div className="flex items-center gap-2 border border-gray-300 rounded-[10px] px-4 h-12 bg-white min-w-[280px]">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="font-['Poppins'] text-sm focus:outline-none" />
                <span className="text-gray-400">-</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="font-['Poppins'] text-sm focus:outline-none" />
                <Calendar size={20} className="text-gray-400 flex-shrink-0" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#205d7d]">
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white rounded-tl-[10px] min-w-[60px]">No</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[150px]">Nama Surat</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[140px]">Nomor Surat</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[180px]">Pengirim</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[200px]">Penerima</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[120px]">Tanggal</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-center text-white rounded-tr-[10px] min-w-[140px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? filteredData.map((row, index) => (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.no}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.namaSurat, e)} className={row.namaSurat.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.namaSurat)}
                        </span>
                      </td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.nomorSurat}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.pengirim, e)} className={row.pengirim.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.pengirim)}
                        </span>
                      </td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.penerima, e)} className={row.penerima.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.penerima)}
                        </span>
                      </td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{formatDate(row.tanggal)}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-center">
                        <button onClick={() => handleDownload(row)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#4180a9] text-white rounded-lg hover:bg-[#356890] transition-colors">
                          <Download size={16} />
                          <span className="text-sm">Download</span>
                        </button>
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

      {tooltipContent && tooltipPosition && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closeTooltip} />
          <div className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs"
            style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`, transform: 'translate(-50%, -100%)', }}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-['Poppins'] text-sm text-gray-900 break-words">{tooltipContent}</p>
              <button onClick={closeTooltip} className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
