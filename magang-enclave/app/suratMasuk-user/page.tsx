"use client";

import { useState, useEffect } from "react";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu, Search, Filter, Plus, FileText, Download, Archive, History, X, Send, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Surat {
  id: number;
  title: string;
  time: string;
  category: string;
  status: string;
  statusColor: string;
  statusBadge: string;
  noSurat: string;
  tanggalSurat: string;
  diterimaTanggal: string;
  perihal: string;
  instansiPenerima: string;
  penggunaSuratKeluar: string;
  isRead: boolean;
}

export default function SuratMasukUserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);
  const [suratItems, setSuratItems] = useState<Surat[]>([]);

  const kategoriDokumen = [
    { id: 1, nama: "Perjanjian Kerja sama", kode: "107" },
    { id: 2, nama: "Surat Keterangan", kode: "105" },
    { id: 3, nama: "Surat Perintah Kerja", kode: "106" },
    { id: 4, nama: "Surat Pernyataan", kode: "108" },
    { id: 5, nama: "Berita Acara", kode: "110" },
    { id: 6, nama: "Perjanjian Tambahan", kode: "200" },
  ];

  const templateDokumen = [
    { id: 1, nama: "Perjanjian Kerja Sama", deskripsi: "Tempalate kerja sama" },
    { id: 2, nama: "Perjanjian Kerja Sama 2", deskripsi: "Kerja sama pihak lain/kontraktor" },
    { id: 3, nama: "Kesepakatan kerja", deskripsi: "Kesepakatan dengan Karyawan" },
  ];

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Surat ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Surat telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Surat telah Dibuat oleh Budiono Siregar", detail: "Tolong revisi bagian isinya ya" },
  ];

  const suratList: Surat[] = [
    {
      id: 1,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Dalam proses",
      statusColor: "#F59E0B",
      statusBadge: "High Priority",
      noSurat: "01/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "BEM Universitas Padjajaran",
      penggunaSuratKeluar: "Chandra Wibawa",
      isRead: false
    },
    {
      id: 2,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Menunggu",
      statusColor: "#6B7280",
      statusBadge: "Medium Priority",
      noSurat: "02/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "BEM Universitas Indonesia",
      penggunaSuratKeluar: "Ahmad Rizki",
      isRead: true
    },
    {
      id: 3,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Dalam proses",
      statusColor: "#F59E0B",
      statusBadge: "Low Priority",
      noSurat: "03/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "Fakultas Teknik",
      penggunaSuratKeluar: "Siti Nurhaliza",
      isRead: false
    },
    {
      id: 4,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noSurat: "04/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "Dekanat",
      penggunaSuratKeluar: "Budi Santoso",
      isRead: true
    },
    {
      id: 5,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noSurat: "05/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "Rektorat",
      penggunaSuratKeluar: "Dewi Lestari",
      isRead: true
    },
    {
      id: 6,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noSurat: "06/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "Himpunan Mahasiswa",
      penggunaSuratKeluar: "Andi Pratama",
      isRead: true
    },
  ];

  // Initialize suratItems with suratList on component mount
  useEffect(() => {
    setSuratItems(suratList);
  }, []);

  const handleSuratClick = (surat: Surat) => {
    // Mark the item as read when clicked
    if (!surat.isRead) {
      setSuratItems(prevItems =>
        prevItems.map(item =>
          item.id === surat.id ? { ...item, isRead: true } : item
        )
      );
    }

    // Toggle: if clicking the same surat, close it; otherwise, open the new one
    if (selectedSurat?.id === surat.id) {
      setSelectedSurat(null);
    } else {
      // Update the selected item to have isRead: true
      setSelectedSurat({ ...surat, isRead: true });
    }
  };

  const handleCloseDetail = () => {
    setSelectedSurat(null);
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
        <div className="px-6 lg:px-10 h-[calc(100vh-88px)] overflow-hidden">
          <div className={`grid gap-6 h-full transition-all duration-300 ${
            selectedSurat ? 'grid-cols-1 lg:grid-cols-[350px_1fr]' : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {/* Left Side - Surat List */}
            <div className={`flex flex-col h-full ${selectedSurat ? 'lg:max-w-[350px]' : ''}`}>
              {/* Search and Filter */}
              <div className="flex gap-3 mb-4 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari surat, no surat ..."
                    className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[12px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>
                <button className="p-3 border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors flex-shrink-0">
                  <Filter size={20} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setIsKategoriModalOpen(true)}
                  className="p-3 bg-[#4180a9] text-white rounded-[12px] hover:bg-[#356890] transition-colors flex-shrink-0"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Surat List */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {suratItems.map((surat) => {
                  const getPriorityColor = (badge: string) => {
                    if (badge === 'High Priority') return '#DC2626';
                    if (badge === 'Medium Priority') return '#F59E0B';
                    if (badge === 'Low Priority') return '#10B981';
                    return '#10B981'; // Selesai - green
                  };

                  const getStatusBgColor = (status: string) => {
                    if (status === 'Dalam proses') return '#FEF3C7';
                    if (status === 'Menunggu') return '#E5E7EB';
                    return '#10B981'; // Selesai - green
                  };

                  const getStatusTextColor = (status: string) => {
                    if (status === 'Dalam proses') return '#92400E';
                    if (status === 'Menunggu') return '#374151';
                    return '#FFFFFF'; // Selesai - white
                  };

                  const priorityColor = getPriorityColor(surat.statusBadge);
                  const leftBorderColor = !surat.isRead ? '#3B82F6' : 'transparent'; // Blue for unread, transparent for read

                  return (
                    <div
                      key={surat.id}
                      onClick={() => handleSuratClick(surat)}
                      className="bg-white rounded-[15px] p-4 border-l-[6px] border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:!border-[#60A5FA] hover:!border-l-[6px] hover:!border-t-[2px] hover:!border-r-[2px] hover:!border-b-[2px]"
                      style={{ borderLeftColor: leftBorderColor }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-base">
                          {surat.title}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-['Poppins'] text-xs text-gray-500">
                            {surat.time}
                          </span>
                          {surat.statusBadge !== 'Selesai' && (
                            <span
                              className="px-2.5 py-1 rounded-md font-['Poppins'] text-xs font-medium text-white whitespace-nowrap"
                              style={{ backgroundColor: priorityColor }}
                            >
                              {surat.statusBadge}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-['Poppins'] text-sm text-gray-600 mb-3">
                        {surat.category}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ 
                            backgroundColor: getStatusBgColor(surat.status),
                            color: getStatusTextColor(surat.status)
                          }}
                        >
                          {surat.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Detail or Empty State */}
            <div className="bg-white rounded-[20px] shadow-sm p-6 lg:p-8 h-full overflow-y-auto">
              {selectedSurat ? (
                <div>
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e]">
                      Detail Surat
                    </h2>
                    <button
                      onClick={handleCloseDetail}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Detail Information */}
                  <div className="bg-white border border-gray-200 rounded-[15px] p-6 mb-6">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          No.Surat
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.noSurat}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Instansi Penerima
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.instansiPenerima}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Pengaju Surat Keluar
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.penggunaSuratKeluar}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Tanggal Surat
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.tanggalSurat}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Diterima Tanggal
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.diterimaTanggal}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Status
                        </p>
                        <span
                          className="inline-block px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ 
                            backgroundColor: selectedSurat.status === 'Selesai' ? selectedSurat.statusColor : selectedSurat.statusColor === '#6B7280' ? '#E5E7EB' : '#FEF3C7',
                            color: selectedSurat.status === 'Selesai' ? '#FFFFFF' : selectedSurat.statusColor === '#6B7280' ? '#374151' : '#92400E'
                          }}
                        >
                          {selectedSurat.status}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Kategori
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.category}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Perihal
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.perihal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mb-6">
                    <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                      <FileText size={18} />
                      Notes Surat
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                      <Download size={18} />
                      Unduh Surat
                    </button>
                    <button 
                      onClick={() => setIsLogHistoryOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors"
                    >
                      <History size={18} />
                      Log History
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="p-3 bg-[#10B981] text-white rounded-full hover:bg-[#059669] transition-colors shadow-md">
                        <Download size={20} />
                      </button>
                      <button className="p-3 bg-[#10B981] text-white rounded-full hover:bg-[#059669] transition-colors shadow-md">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-8 flex flex-col items-center justify-center min-h-[500px] bg-gray-50">
                    <div className="text-center">
                      <h3 className="font-['Poppins'] font-semibold text-2xl text-[#1e1e1e] mb-4">
                        Timeline Pengerjaan Proyek Magang
                      </h3>
                      <p className="font-['Poppins'] text-lg text-[#1e1e1e] mb-8">
                        Duplikasi Aplikasi Monitoring Dokumen
                      </p>
                      <div className="w-80 h-80 mx-auto relative">
                        <Image
                          src="/logo-enclave.png"
                          alt="Document Preview"
                          width={320}
                          height={320}
                          className="object-contain opacity-80"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-[#4180a9] rounded-[20px] p-8 text-white text-center max-w-xs">
                    <div className="mb-4">
                      <FileText size={48} className="mx-auto" strokeWidth={1.5} />
                    </div>
                    <p className="font-['Poppins'] font-medium text-lg">
                      Pilih surat untuk melihat detail!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Dokumen Modal */}
      {isKategoriModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[550px] max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#4180a9]">
                Kategori Dokumen
              </h2>
              <button
                onClick={() => setIsKategoriModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-76px)]">
              {/* Table Header */}
              <div className="grid grid-cols-[1.5fr_1fr] bg-[#295f7f] text-white py-3.5 px-5 sticky top-0">
                <div className="font-['Poppins'] font-medium text-[15px]">
                  Nama Kategori
                </div>
                <div className="font-['Poppins'] font-medium text-[15px]">
                  Kode Surat
                </div>
              </div>

              {/* Table Body */}
              <div>
                {kategoriDokumen.map((kategori, index) => (
                  <div key={kategori.id}>
                    <div
                      className="grid grid-cols-[1.5fr_1fr] py-4 px-5 hover:bg-gray-50 cursor-pointer transition-colors group"
                      onClick={() => {
                        setSelectedKategori(kategori.nama);
                        setIsTemplateModalOpen(true);
                      }}
                    >
                      <div className="font-['Poppins'] text-[15px] text-[#1e1e1e] flex items-center">
                        {kategori.nama}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-['Poppins'] text-[15px] text-gray-600">
                          {kategori.kode}
                        </span>
                        <ChevronRight size={22} className="text-gray-400 group-hover:text-[#4180a9] transition-colors" />
                      </div>
                    </div>
                    {index < kategoriDokumen.length - 1 && (
                      <div className="border-b border-gray-200 mx-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Dokumen Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[550px] max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#4180a9]">
                Template Dokumen
              </h2>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-76px)]">
              {/* Table Header */}
              <div className="grid grid-cols-[1.2fr_1.8fr] bg-[#295f7f] text-white py-3.5 px-5 sticky top-0">
                <div className="font-['Poppins'] font-medium text-[15px]">
                  Nama Kategori
                </div>
                <div className="font-['Poppins'] font-medium text-[15px]">
                  Deskripsi Template
                </div>
              </div>

              {/* Table Body */}
              <div>
                {templateDokumen.map((template, index) => (
                  <div key={template.id}>
                    <div
                      className="grid grid-cols-[1.2fr_1.8fr] py-4 px-5 hover:bg-gray-50 cursor-pointer transition-colors group"
                      onClick={() => {
                        // Handle template selection
                        setIsTemplateModalOpen(false);
                        setIsKategoriModalOpen(false);
                      }}
                    >
                      <div className="font-['Poppins'] text-[15px] text-[#1e1e1e] flex items-center">
                        {template.nama}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-['Poppins'] text-[15px] text-gray-600">
                          {template.deskripsi}
                        </span>
                        <ChevronRight size={22} className="text-gray-400 group-hover:text-[#4180a9] transition-colors" />
                      </div>
                    </div>
                    {index < templateDokumen.length - 1 && (
                      <div className="border-b border-gray-200 mx-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log History Modal */}
      {isLogHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[550px] max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#4180a9]">
                Log History
              </h2>
              <button
                onClick={() => setIsLogHistoryOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-76px)] p-6">
              <div className="space-y-6">
                {logHistory.map((log, index) => (
                  <div key={log.id} className="flex gap-4 relative">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full border-4 border-gray-400 bg-white flex-shrink-0 mt-1"></div>
                      {index < logHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <p className="font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-1">
                        {log.tanggal}
                      </p>
                      <p className="font-['Poppins'] text-[15px] font-semibold text-[#1e1e1e] mb-1">
                        {log.aksi}
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {log.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}