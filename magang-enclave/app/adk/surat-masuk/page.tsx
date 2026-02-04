"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarAdk from "@/app/components/sidebar-adk";
import { Menu, Search, Filter, FileText, Download, History, X, Check, Clock, Archive, XCircle, Plus, Upload, Calendar } from "lucide-react";
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
  priority?: 'high' | 'medium' | 'low';
  priorityBadge?: string;
  instansiPenerima: string;
  penggunaSuratKeluar: string;
  isRead: boolean;
}

export default function SuratMasukAdkPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    notes: "",
    password: ""
  });
  const [formData, setFormData] = useState({
    instansiPengirim: "",
    ditujukanKepada: "",
    nomorSurat: "",
    tanggalDibuat: "",
    tanggalDiterima: "",
    perihal: "",
    lampiran: "",
    priority: "" as 'high' | 'medium' | 'low' | '',
    dokumen: null as File | null
  });
  const searchParams = useSearchParams();

  // Function to format date input with auto slashes
  const handleDateInput = (value: string, field: 'tanggalDibuat' | 'tanggalDiterima') => {
    // Remove all non-digit characters
    const numbersOnly = value.replace(/\D/g, '');

    // Format with slashes: DD/MM/YYYY
    let formatted = numbersOnly;
    if (numbersOnly.length >= 3) {
      formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2);
    }
    if (numbersOnly.length >= 5) {
      formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4) + '/' + numbersOnly.slice(4, 8);
    }

    setFormData({...formData, [field]: formatted});
  };

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Surat ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Surat telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Surat telah Dibuat oleh Budiono Siregar", detail: "Surat telah dibuat" },
  ];

  const suratList: Surat[] = [
    {
      id: 1,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noSurat: "01/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "BEM Universitas Padjajaran",
      penggunaSuratKeluar: "Chandra Wibawa",
      isRead: false,
      priority: 'high',
      priorityBadge: 'High Priority'
    },
    {
      id: 2,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noSurat: "02/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "BEM Universitas Indonesia",
      penggunaSuratKeluar: "Ahmad Rizki",
      isRead: true,
      priority: 'medium',
      priorityBadge: 'Medium Priority'
    },
    {
      id: 3,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noSurat: "03/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      instansiPenerima: "Fakultas Teknik",
      penggunaSuratKeluar: "Siti Nurhaliza",
      isRead: false,
      priority: 'low',
      priorityBadge: 'Low Priority'
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

  const [suratItems, setSuratItems] = useState<Surat[]>(suratList);

  // Auto-select surat from URL parameter
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const suratId = parseInt(id);
      const surat = suratItems.find(s => s.id === suratId);
      if (surat) {
        setSelectedSurat(surat);
        // Mark as read
        if (!surat.isRead) {
          setSuratItems(prevItems =>
            prevItems.map(item =>
              item.id === suratId ? { ...item, isRead: true } : item
            )
          );
        }
      }
    }
  }, [searchParams, suratItems]);

  const handleSuratClick = (surat: Surat) => {
    if (!surat.isRead) {
      setSuratItems(prevItems =>
        prevItems.map(item =>
          item.id === surat.id ? { ...item, isRead: true } : item
        )
      );
    }

    if (selectedSurat?.id === surat.id) {
      setSelectedSurat(null);
    } else {
      setSelectedSurat({ ...surat, isRead: true });
    }
  };

  const handleApprove = () => {
    if (selectedSurat) {
      alert(`Surat "${selectedSurat.title}" telah disetujui`);
      setSuratItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedSurat.id ? { ...item, status: "Selesai", statusColor: "#10B981", statusBadge: "Selesai" } : item
        )
      );
      setSelectedSurat(null);
    }
  };

  const handlePending = () => {
    if (selectedSurat) {
      alert(`Surat "${selectedSurat.title}" ditandai pending`);
      setSuratItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedSurat.id ? { ...item, status: "Dalam Proses", statusColor: "#F59E0B", statusBadge: "Dalam Proses" } : item
        )
      );
      setSelectedSurat(null);
    }
  };

  const handleReject = () => {
    if (selectedSurat) {
      const reason = prompt("Alasan penolakan:");
      if (reason) {
        alert(`Surat "${selectedSurat.title}" ditolak dengan alasan: ${reason}`);
        setSuratItems(prevItems =>
          prevItems.map(item =>
            item.id === selectedSurat.id ? { ...item, status: "Ditolak", statusColor: "#DC2626", statusBadge: "Ditolak" } : item
          )
        );
        setSelectedSurat(null);
      }
    }
  };

  const handleDownload = () => {
    if (selectedSurat) {
      alert(`Mengunduh surat: ${selectedSurat.noSurat}`);
    }
  };

  const handleArsip = () => {
    if (selectedSurat) {
      router.push('/adk/arsip/surat-masuk');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdk
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header */}
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
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="h-12 w-12 bg-[#4180a9] text-white rounded-full flex items-center justify-center hover:bg-[#357a9e] transition-colors shadow-md"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>
              </div>

              {/* Surat List */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {suratItems.filter(surat =>
                  surat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  surat.noSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  surat.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  surat.instansiPenerima.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((surat) => {
                  const leftBorderColor = !surat.isRead ? '#3B82F6' : 'transparent';

                  return (
                    <div
                      key={surat.id}
                      onClick={() => handleSuratClick(surat)}
                      className="bg-white rounded-[15px] p-3 border-l-[4px] shadow-md hover:shadow-lg transition-all cursor-pointer"
                      style={{ borderLeftColor: leftBorderColor }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-sm">
                          {surat.title}
                        </h3>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-['Poppins'] text-xs text-gray-500">
                            {surat.time}
                          </span>
                          {surat.priority ? (
                            <span
                              className="px-2 py-0.5 rounded-full font-['Poppins'] text-[10px] font-medium text-white"
                              style={{
                                backgroundColor: surat.priority === 'high' ? '#DC2626' :
                                                surat.priority === 'medium' ? '#F59E0B' : '#10B981'
                              }}
                            >
                              {surat.priorityBadge}
                            </span>
                          ) : (
                            <span className="h-[18px]" />
                          )}
                        </div>
                      </div>
                      <p className="font-['Poppins'] text-xs text-gray-600 mb-1">
                        {surat.category}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ backgroundColor: surat.statusColor + '20', color: surat.statusColor }}
                        >
                          {surat.statusBadge}
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
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e]">
                      Informasi Surat
                    </h2>
                  </div>

                  {/* Detail Information */}
                  <div className="space-y-4 mb-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          No.Surat
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.noSurat}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Instansi Penerima
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.instansiPenerima}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Pengguna Surat Keluar
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.penggunaSuratKeluar}
                        </p>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Tanggal Surat
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.tanggalSurat}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Diterima Tanggal
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.diterimaTanggal}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Status
                        </p>
                        <span
                          className="inline-block px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ backgroundColor: selectedSurat.statusColor + '20', color: selectedSurat.statusColor }}
                        >
                          {selectedSurat.statusBadge}
                        </span>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Kategori
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.category}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-['Poppins'] text-sm font-medium text-gray-500 mb-1">
                          Perihal
                        </p>
                        <p className="font-['Poppins'] text-sm text-[#1e1e1e] font-medium">
                          {selectedSurat.perihal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                    <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                      <Download size={18} />
                      Unduh Surat
                    </button>
                    <button onClick={handleArsip} className="flex items-center gap-2 px-4 py-2 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                      <Archive size={18} />
                      Arsip
                    </button>
                    <button
                      onClick={() => setIsLogHistoryOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors"
                    >
                      <History size={18} />
                      Log History
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={handleApprove}
                        className="p-3 bg-[#10B981] text-white rounded-full hover:bg-[#059669] transition-colors shadow-md"
                        title="Setujui"
                      >
                        <Check size={20} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={handlePending}
                        className="p-3 bg-[#F59E0B] text-white rounded-full hover:bg-[#D97706] transition-colors shadow-md"
                        title="Pending"
                      >
                        <Clock size={20} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={handleReject}
                        className="p-3 bg-[#DC2626] text-white rounded-full hover:bg-[#B91C1C] transition-colors shadow-md"
                        title="Tolak"
                      >
                        <XCircle size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div className="mt-6 border border-gray-200 rounded-[15px] p-8 flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
                    <div className="text-center">
                      <Image
                        src="/document-preview.svg"
                        alt="Document Preview"
                        width={300}
                        height={300}
                        className="mx-auto mb-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <h3 className="font-['Poppins'] font-semibold text-xl text-gray-800 mb-2">
                        {selectedSurat.title}
                      </h3>
                      <p className="font-['Poppins'] text-base text-gray-600">
                        Timeline Pengerjaan Proyek Magang<br/>Duplikasi Aplikasi Monitoring Dokumen
                      </p>
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

      {/* Log History Modal */}
      {isLogHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="font-['Poppins'] font-semibold text-xl">Log History</h2>
              <button
                onClick={() => setIsLogHistoryOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {logHistory.map((log) => (
                  <div key={log.id} className="border-l-4 border-[#277ba7] pl-4 py-2">
                    <p className="text-sm text-gray-500 font-['Poppins']">{log.tanggal}</p>
                    <p className="font-['Poppins'] font-medium text-black">{log.aksi}</p>
                    <p className="text-sm text-gray-600 font-['Poppins']">{log.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-2xl w-full flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="font-['Poppins'] font-semibold text-xl text-[#0066A1]">Informasi Surat</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-[#0066A1]" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form className="space-y-4">
                {/* Row 1: Instansi Pengirim & Ditujukan Kepada */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                      Instansi Pengirim<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.instansiPengirim}
                      onChange={(e) => setFormData({...formData, instansiPengirim: e.target.value})}
                      placeholder="Masukan nama instansi..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    />
                  </div>
                  <div>
                    <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                      Ditujukan Kepada
                    </label>
                    <select
                      value={formData.ditujukanKepada}
                      onChange={(e) => setFormData({...formData, ditujukanKepada: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm text-gray-400 focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    >
                      <option value="">Pilih Direksi</option>
                      <option value="direktur">Direktur</option>
                      <option value="wakil_direktur">Wakil Direktur</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Nomor Surat */}
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                    Nomor Surat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({...formData, nomorSurat: e.target.value})}
                    placeholder="Masukan nomor surat....."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Row 3: Tanggal Dibuat & Tanggal Diterima */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                      Tanggal Dibuat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min="1900-01-01"
                      max="2099-12-31"
                      value={formData.tanggalDibuat}
                      onChange={(e) => setFormData({...formData, tanggalDibuat: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    />
                  </div>
                  <div>
                    <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                      Tanggal Diterima <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min="1900-01-01"
                      max="2099-12-31"
                      value={formData.tanggalDiterima}
                      onChange={(e) => setFormData({...formData, tanggalDiterima: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    />
                  </div>
                </div>

                {/* Row 4: Perihal */}
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                    Perihal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.perihal}
                    onChange={(e) => setFormData({...formData, perihal: e.target.value})}
                    placeholder="Kesepakatan Kerja - HRD"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Row 5: Lampiran Tersedia & Sifat */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                      Lampiran Tersedia
                    </label>
                    <select
                      value={formData.lampiran}
                      onChange={(e) => setFormData({...formData, lampiran: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                      style={{ color: formData.lampiran === '' ? '#9CA3AF' : '#1e1e1e' }}
                    >
                      <option value="" style={{ color: '#0066A1', backgroundColor: '#E6F2FF' }}>Lampiran pada dokumen</option>
                      <option value="ya">Ya</option>
                      <option value="tidak">Tidak</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                      Sifat
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as 'high' | 'medium' | 'low' | ''})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                      style={{ color: formData.priority ? '#1e1e1e' : '#9CA3AF' }}
                    >
                      <option value="" style={{ color: '#0066A1', backgroundColor: '#E6F2FF' }}>Pilih urgensi dokumen</option>
                      <option value="high" style={{ color: '#DC2626' }}>High Priority</option>
                      <option value="medium" style={{ color: '#F59E0B' }}>Medium Priority</option>
                      <option value="low" style={{ color: '#10B981' }}>Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Row 6: Upload Dokumen */}
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                    Unggah Dokumen (Mandatory)
                  </label>
                  <p className="font-['Poppins'] text-xs text-gray-500 mb-2">
                    Unggah dokumen pendukung disini jika tersedia
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <Upload size={24} className="text-gray-500" />
                    </div>
                    <p className="font-['Poppins'] text-sm text-gray-600 mb-1">
                      Drag & Drop or{" "}
                      <label className="text-[#0066A1] cursor-pointer hover:underline">
                        Choose File
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFormData({...formData, dokumen: file});
                          }}
                        />
                      </label>
                      {" "}to upload
                    </p>
                    <p className="font-['Poppins'] text-xs text-gray-400">
                      Jpg (Max : 5 Mb)
                    </p>
                    {formData.dokumen && (
                      <p className="font-['Poppins'] text-xs text-green-600 mt-2">
                        File: {formData.dokumen.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-['Poppins'] text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#4180a9] text-white rounded-lg font-['Poppins'] text-sm font-medium hover:bg-[#357a9e] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsConfirmationOpen(true);
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full">
            <div className="p-6">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-['Poppins'] font-semibold text-xl text-center text-black mb-2">
                Konfirmasi Persetujuan
              </h2>

              {/* Description */}
              <p className="font-['Poppins'] text-sm text-center text-gray-600 mb-6">
                Demi keamanan, setiap aksi persetujuan memerlukan verifikasi akun. Masukkan password dan catatan sebelum melanjutkan proses
              </p>

              {/* Form */}
              <div className="space-y-4">
                {/* Notes Field */}
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={confirmationData.notes}
                    onChange={(e) => setConfirmationData({...confirmationData, notes: e.target.value})}
                    placeholder="Masukan catatan..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-black mb-2">
                    password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmationData.password}
                    onChange={(e) => setConfirmationData({...confirmationData, password: e.target.value})}
                    placeholder="Masukan password akun anda..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsConfirmationOpen(false);
                      setConfirmationData({ notes: "", password: "" });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg font-['Poppins'] text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Form submitted:', formData);
                      console.log('Confirmation data:', confirmationData);
                      setIsConfirmationOpen(false);
                      setIsFormOpen(false);
                      // Reset both forms
                      setFormData({
                        instansiPengirim: "",
                        ditujukanKepada: "",
                        nomorSurat: "",
                        tanggalDibuat: "",
                        tanggalDiterima: "",
                        perihal: "",
                        lampiran: "",
                        priority: "",
                        dokumen: null
                      });
                      setConfirmationData({ notes: "", password: "" });
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-['Poppins'] text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
