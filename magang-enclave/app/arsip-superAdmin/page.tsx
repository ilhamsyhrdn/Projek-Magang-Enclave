"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-superAdmin";
import { Menu, Search, Calendar, Download, X } from "lucide-react";

interface ArchiveItem {
  no: number;
  nama: string;
  nomor: string;
  pengirim?: string;
  penerima?: string;
  tujuan?: string;
  perihal?: string;
  kategori?: string;
  judulRapat?: string;
  lokasi?: string;
  peserta?: string;
  tanggal: string;
}

export default function ArsipSuperAdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"surat-masuk" | "surat-keluar" | "memo" | "notulensi">("surat-masuk");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const suratMasukData: ArchiveItem[] = [
    { no: 1, nama: "Surat Undangan Rapat", nomor: "001/SM/11/2025", pengirim: "Dekan Fakultas Teknik", penerima: "BEM FT", tanggal: "2025-11-15" },
    { no: 2, nama: "Surat Permohonan Kerjasama", nomor: "002/SM/11/2025", pengirim: "PT. Tech Indonesia", penerima: "Dept. Kewirausahaan", tanggal: "2025-11-12" },
    { no: 3, nama: "Surat Pemberitahuan", nomor: "003/SM/10/2025", pengirim: "Universitas", penerima: "Ketua BEM", tanggal: "2025-10-22" },
    { no: 4, nama: "Surat Izin Kegiatan", nomor: "004/SM/10/2025", pengirim: "Rektorat", penerima: "BEM FT", tanggal: "2025-10-18" },
    { no: 5, nama: "Surat Sponsorship", nomor: "005/SM/09/2025", pengirim: "PT. Digital Solutions", penerima: "Dept. Kewirausahaan", tanggal: "2025-09-20" },
  ];

  const suratKeluarData: ArchiveItem[] = [
    { no: 1, nama: "Surat Undangan Rapat", nomor: "01/SK/11/2025", pengirim: "Ketua Umum", penerima: "Seluruh Pengurus", tanggal: "2025-11-15" },
    { no: 2, nama: "Surat Permohonan Sponsorship", nomor: "02/SK/11/2025", pengirim: "Dept. Kewirausahaan", penerima: "PT. Digital Solutions", tanggal: "2025-11-12" },
    { no: 3, nama: "Surat Kerjasama", nomor: "03/SK/10/2025", pengirim: "Dept. Hubungan Eksternal", penerima: "Universitas Padjajaran", tanggal: "2025-10-22" },
    { no: 4, nama: "Surat Pemberitahuan Kegiatan", nomor: "04/SK/10/2025", pengirim: "Dept. Media Informasi", penerima: "Fakultas Teknik", tanggal: "2025-10-18" },
    { no: 5, nama: "Surat Permohonan Izin", nomor: "05/SK/09/2025", pengirim: "Dept. Pengembangan Organisasi", penerima: "Dekanat FT", tanggal: "2025-09-20" },
  ];

  const memoData: ArchiveItem[] = [
    { no: 1, nama: "Pemberitahuan Jadwal Rapat Koordinasi", nomor: "MEM/001/2025", kategori: "Internal", tujuan: "Seluruh Departemen", tanggal: "2025-11-15" },
    { no: 2, nama: "Permintaan Laporan Keuangan Bulan Oktober", nomor: "MEM/002/2025", kategori: "Internal", tujuan: "Dept. Keuangan", tanggal: "2025-11-10" },
    { no: 3, nama: "Permohonan Dukungan Event", nomor: "MEM/003/2025", kategori: "Eksternal", tujuan: "Fakultas Teknik", tanggal: "2025-10-25" },
    { no: 4, nama: "Permintaan Publikasi Kegiatan", nomor: "MEM/004/2025", kategori: "Internal", tujuan: "Dept. Media", tanggal: "2025-10-18" },
    { no: 5, nama: "Evaluasi Program Kerja Semester 1", nomor: "MEM/005/2025", kategori: "Internal", tujuan: "Seluruh Pengurus", tanggal: "2025-09-20" },
  ];

  const notulensiData: ArchiveItem[] = [
    { no: 1, nama: "Rapat Evaluasi Kinerja", nomor: "NOT-001/2025", judulRapat: "Rapat Evaluasi Kinerja", lokasi: "Ruang Rapat A", peserta: "Seluruh Pengurus Inti", tanggal: "2025-11-15" },
    { no: 2, nama: "Rapat Koordinasi Departemen", nomor: "NOT-002/2025", judulRapat: "Rapat Koordinasi Departemen", lokasi: "Ruang Rapat B", peserta: "Kepala Departemen", tanggal: "2025-11-10" },
    { no: 3, nama: "Rapat Persiapan Event", nomor: "NOT-003/2025", judulRapat: "Rapat Persiapan Event", lokasi: "Ruang Serbaguna", peserta: "Panitia Event", tanggal: "2025-10-25" },
    { no: 4, nama: "Rapat Pleno", nomor: "NOT-004/2025", judulRapat: "Rapat Pleno", lokasi: "Auditorium", peserta: "Seluruh Anggota BEM", tanggal: "2025-10-18" },
    { no: 5, nama: "Rapat Program Kerja", nomor: "NOT-005/2025", judulRapat: "Rapat Program Kerja", lokasi: "Ruang Rapat A", peserta: "Pengurus Harian", tanggal: "2025-09-20" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`;
  };

  const getCurrentData = (): ArchiveItem[] => {
    switch (activeTab) {
      case "surat-masuk": return suratMasukData;
      case "surat-keluar": return suratKeluarData;
      case "memo": return memoData;
      case "notulensi": return notulensiData;
    }
  };

  const filteredData = getCurrentData().filter(item => {
    const matchSearch = !searchQuery || 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pengirim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penerima?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tujuan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.judulRapat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.peserta?.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleDownload = (row: ArchiveItem) => {
    alert(`Download ${activeTab} ${row.nomor}`);
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
              <button onClick={() => setActiveTab("surat-masuk")}
                className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors relative ${
                  activeTab === "surat-masuk" ? "text-[#4180a9] font-semibold" : "text-gray-500 font-normal hover:text-gray-700"
                }`}>
                Surat Masuk
                {activeTab === "surat-masuk" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />}
              </button>
              <button onClick={() => setActiveTab("surat-keluar")}
                className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors relative ${
                  activeTab === "surat-keluar" ? "text-[#4180a9] font-semibold" : "text-gray-500 font-normal hover:text-gray-700"
                }`}>
                Surat Keluar
                {activeTab === "surat-keluar" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />}
              </button>
              <button onClick={() => setActiveTab("memo")}
                className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors relative ${
                  activeTab === "memo" ? "text-[#4180a9] font-semibold" : "text-gray-500 font-normal hover:text-gray-700"
                }`}>
                Memo
                {activeTab === "memo" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />}
              </button>
              <button onClick={() => setActiveTab("notulensi")}
                className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors relative ${
                  activeTab === "notulensi" ? "text-[#4180a9] font-semibold" : "text-gray-500 font-normal hover:text-gray-700"
                }`}>
                Notulensi
                {activeTab === "notulensi" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari ${activeTab} ...`}
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
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[200px]">
                      {activeTab === "surat-masuk" || activeTab === "surat-keluar" ? "Nama Surat" : 
                       activeTab === "memo" ? "Perihal" : "Judul Rapat"}
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[140px]">
                      {activeTab === "surat-masuk" || activeTab === "surat-keluar" ? "Nomor Surat" : 
                       activeTab === "memo" ? "No Memo" : "No Notulensi"}
                    </th>
                    {(activeTab === "surat-masuk" || activeTab === "surat-keluar") && (
                      <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[180px]">Pengirim</th>
                    )}
                    {(activeTab === "surat-masuk" || activeTab === "surat-keluar") && (
                      <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[180px]">Penerima</th>
                    )}
                    {activeTab === "memo" && (
                      <>
                        <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[120px]">Kategori</th>
                        <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[180px]">Tujuan</th>
                      </>
                    )}
                    {activeTab === "notulensi" && (
                      <>
                        <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[150px]">Lokasi</th>
                        <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[200px]">Peserta</th>
                      </>
                    )}
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-left text-white min-w-[120px]">Tanggal</th>
                    <th className="font-['Poppins'] font-medium text-sm py-4 px-4 text-center text-white rounded-tr-[10px] min-w-[140px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? filteredData.map((row, index) => (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.no}</td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                        <span onClick={(e) => handleTextClick(row.nama, e)} className={row.nama.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                          {truncateText(row.nama)}
                        </span>
                      </td>
                      <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.nomor}</td>
                      {(activeTab === "surat-masuk" || activeTab === "surat-keluar") && (
                        <>
                          <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                            <span onClick={(e) => handleTextClick(row.pengirim || "", e)} className={row.pengirim && row.pengirim.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                              {truncateText(row.pengirim || "")}
                            </span>
                          </td>
                          <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                            <span onClick={(e) => handleTextClick(row.penerima || "", e)} className={row.penerima && row.penerima.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                              {truncateText(row.penerima || "")}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "memo" && (
                        <>
                          <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">{row.kategori}</td>
                          <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                            <span onClick={(e) => handleTextClick(row.tujuan || "", e)} className={row.tujuan && row.tujuan.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                              {truncateText(row.tujuan || "")}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "notulensi" && (
                        <>
                          <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                            <span onClick={(e) => handleTextClick(row.lokasi || "", e)} className={row.lokasi && row.lokasi.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                              {truncateText(row.lokasi || "")}
                            </span>
                          </td>
                          <td className="font-['Poppins'] text-sm py-4 px-4 text-gray-900">
                            <span onClick={(e) => handleTextClick(row.peserta || "", e)} className={row.peserta && row.peserta.length > 30 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}>
                              {truncateText(row.peserta || "")}
                            </span>
                          </td>
                        </>
                      )}
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
                      <td colSpan={activeTab === "memo" || activeTab === "notulensi" ? 6 : 7} className="py-8 text-center font-['Poppins'] text-sm text-gray-500">
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
