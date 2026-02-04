"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarDirektur from "@/app/components/sidebar-direktur";
import { Menu, Search, Filter, FileText, Download, Archive, History, X, Send, ChevronRight, Check, Clock } from "lucide-react";
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

export default function SuratKeluarApproverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Surat ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Surat telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Surat telah Dibuat oleh Budiono Siregar", detail: "Tolong revisi bagian isinya ya" },
  ];

  const suratList: Surat[] = [
    {
      id: 1,
      title: "Surat Permohonan Kerjasama",
      time: "14:30 Pm",
      category: "Surat Keluar - PKS",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noSurat: "SK/001/C111/107/01/2026",
      tanggalSurat: "10/01/2026",
      diterimaTanggal: "12/01/2026",
      perihal: "Permohonan Kerjasama Proyek",
      priority: 'high',
      priorityBadge: 'High Priority',
      instansiPenerima: "PT. Teknologi Maju",
      penggunaSuratKeluar: "Budiono Siregar",
      isRead: false
    },
    {
      id: 2,
      title: "Surat Undangan Rapat",
      time: "10:15 Am",
      category: "Surat Keluar - Undangan",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noSurat: "SK/002/C111/105/01/2026",
      tanggalSurat: "11/01/2026",
      diterimaTanggal: "12/01/2026",
      perihal: "Undangan Rapat Koordinasi",
      priority: 'medium',
      priorityBadge: 'Medium Priority',
      instansiPenerima: "Semua Divisi",
      penggunaSuratKeluar: "Ahmad Rizki",
      isRead: false
    },
    {
      id: 3,
      title: "Surat Pemberitahuan",
      time: "09:00 Am",
      category: "Surat Keluar - Pemberitahuan",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noSurat: "SK/003/C111/108/01/2026",
      tanggalSurat: "09/01/2026",
      diterimaTanggal: "10/01/2026",
      perihal: "Pemberitahuan Kebijakan Baru",
      instansiPenerima: "Seluruh Karyawan",
      penggunaSuratKeluar: "Siti Nurhaliza",
      isRead: true
    },
    {
      id: 4,
      title: "Surat Tugas",
      time: "16:45 Pm",
      category: "Surat Keluar - Penugasan",
      status: "Ditolak",
      statusColor: "#DC2626",
      statusBadge: "Ditolak",
      noSurat: "SK/004/C111/106/01/2026",
      tanggalSurat: "08/01/2026",
      diterimaTanggal: "09/01/2026",
      perihal: "Penugasan Tim Proyek",
      instansiPenerima: "Tim Engineering",
      penggunaSuratKeluar: "Budi Santoso",
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

  const handleCloseDetail = () => {
    setSelectedSurat(null);
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
      // In production, implement actual file download
    }
  };

  const handleArsip = () => {
    if (selectedSurat) {
      router.push('/direktur/arsip/surat-keluar');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDirektur
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
                  <h2 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e] mb-6">
                    Detail Surat
                  </h2>

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
                          backgroundColor: selectedSurat.statusColor + '20',
                          color: selectedSurat.statusColor
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
                  <button
                    onClick={handleArsip}
                    className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors"
                  >
                    <Archive size={18} />
                    Arsip Surat Keluar
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors"
                  >
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
                      <X size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-8 flex flex-col items-center justify-center min-h-[500px] bg-gray-50">
                  <div className="text-center">
                    <h3 className="font-['Poppins'] font-semibold text-2xl text-[#1e1e1e] mb-4">
                      {selectedSurat.title}
                    </h3>
                    <p className="font-['Poppins'] text-lg text-[#1e1e1e] mb-8">
                      {selectedSurat.perihal}
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







    </div>
  );
}


