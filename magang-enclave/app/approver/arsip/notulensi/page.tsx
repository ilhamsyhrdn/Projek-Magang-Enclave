"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-approver";
import { Menu, Search, Calendar, Download, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotulensiData {
  no: number;
  noNotulensi: string;
  tanggalRapat: string;
  judulRapat: string;
  lokasi: string;
  peserta: string;
}

export default function ArsipNotulensiPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("notulensi");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const tabs = [
    { id: "surat-masuk", label: "Surat Masuk", path: "/approver/arsip/surat-masuk" },
    { id: "surat-keluar", label: "Surat Keluar", path: "/approver/arsip/surat-keluar" },
    { id: "memo", label: "Memo", path: "/approver/arsip/memo" },
    { id: "notulensi", label: "Notulensi", path: "/approver/arsip/notulensi" },
  ];

  const allData: NotulensiData[] = [
    { no: 1, noNotulensi: "NOT-001/2025", tanggalRapat: "2025-11-15", judulRapat: "Rapat Evaluasi Kinerja", lokasi: "Ruang Rapat A", peserta: "Seluruh Pengurus Inti" },
    { no: 2, noNotulensi: "NOT-002/2025", tanggalRapat: "2025-11-10", judulRapat: "Rapat Koordinasi Departemen", lokasi: "Ruang Rapat B", peserta: "Kepala Departemen" },
    { no: 3, noNotulensi: "NOT-003/2025", tanggalRapat: "2025-10-25", judulRapat: "Rapat Persiapan Event", lokasi: "Ruang Serbaguna", peserta: "Panitia Event" },
    { no: 4, noNotulensi: "NOT-004/2025", tanggalRapat: "2025-10-18", judulRapat: "Rapat Pleno", lokasi: "Auditorium", peserta: "Seluruh Anggota BEM" },
    { no: 5, noNotulensi: "NOT-005/2025", tanggalRapat: "2025-09-20", judulRapat: "Rapat Program Kerja", lokasi: "Ruang Rapat A", peserta: "Pengurus Harian" },
    { no: 6, noNotulensi: "NOT-006/2025", tanggalRapat: "2025-09-15", judulRapat: "Rapat Evaluasi Anggaran", lokasi: "Ruang Keuangan", peserta: "Dept. Keuangan & Ketua Umum" },
    { no: 7, noNotulensi: "NOT-007/2025", tanggalRapat: "2025-08-10", judulRapat: "Rapat Koordinasi Event", lokasi: "Ruang Rapat B", peserta: "Tim Koordinator" },
    { no: 8, noNotulensi: "NOT-008/2025", tanggalRapat: "2025-08-05", judulRapat: "Rapat Pengembangan SDM", lokasi: "Ruang Training", peserta: "Dept. Pengembangan Organisasi" },
    { no: 9, noNotulensi: "NOT-009/2025", tanggalRapat: "2025-07-20", judulRapat: "Rapat Evaluasi Kegiatan", lokasi: "Ruang Rapat A", peserta: "Panitia Kegiatan" },
    { no: 10, noNotulensi: "NOT-010/2025", tanggalRapat: "2025-07-15", judulRapat: "Rapat Strategis", lokasi: "Ruang VIP", peserta: "Pengurus Inti" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
  };

  const filteredData = allData.filter(item => {
    const matchSearch = !searchQuery || 
      item.noNotulensi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.judulRapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.peserta.toLowerCase().includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.tanggalRapat);
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

  const handleDownload = (row: NotulensiData) => {
    alert(`Download notulensi ${row.noNotulensi}`);
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
                  placeholder="Cari notulensi, no notulensi, judul, lokasi ..."
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
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[140px]">No Notulensi</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[120px]">Tanggal Rapat</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[200px]">Judul Rapat</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[150px]">Lokasi</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[200px]">Peserta</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-center text-white rounded-tr-[10px] min-w-[140px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? filteredData.map((row, index) => (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.no}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.noNotulensi}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{formatDate(row.tanggalRapat)}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.judulRapat, e)} className={row.judulRapat.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.judulRapat)}
                        </span>
                      </td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.lokasi, e)} className={row.lokasi.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.lokasi)}
                        </span>
                      </td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.peserta, e)} className={row.peserta.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.peserta)}
                        </span>
                      </td>
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
