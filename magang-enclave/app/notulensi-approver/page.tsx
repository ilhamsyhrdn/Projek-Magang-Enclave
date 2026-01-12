"use client";

import { useState } from "react";
import SidebarApprover from "@/app/components/sidebar-approver";
import { Menu, Search, Filter, FileText, Download, History, X, Check, Clock, Archive } from "lucide-react";
import Image from "next/image";

interface Notulensi {
  id: number;
  title: string;
  time: string;
  category: string;
  status: string;
  statusColor: string;
  statusBadge: string;
  noNotulensi: string;
  tanggalNotulen: string;
  tanggalSelesai: string;
  rapat: string;
  judulNotulen: string;
  pembuat: string;
  isRead: boolean;
}

export default function NotulensiApproverPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotulensi, setSelectedNotulensi] = useState<Notulensi | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Notulensi ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Notulensi telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Notulensi telah Dibuat oleh Budiono Siregar", detail: "Notulensi telah dibuat" },
  ];

  const notulensiList: Notulensi[] = [
    {
      id: 1,
      title: "Rapat Evaluasi Proyek",
      time: "10:00 Am",
      category: "Notulensi Rapat Evaluasi",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noNotulensi: "NOT/001/EVA/01/2026",
      tanggalNotulen: "10/01/2026",
      tanggalSelesai: "12/01/2026",
      rapat: "Ruang Meeting Lt. 3",
      judulNotulen: "Evaluasi Proyek Q4 2025",
      pembuat: "Siti Nurhaliza",
      isRead: false
    },
    {
      id: 2,
      title: "Rapat Koordinasi Tim",
      time: "13:45 Pm",
      category: "Notulensi Rapat Koordinasi",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noNotulensi: "NOT/002/KOR/01/2026",
      tanggalNotulen: "11/01/2026",
      tanggalSelesai: "12/01/2026",
      rapat: "Ruang Board Room",
      judulNotulen: "Koordinasi Tim Proyek",
      pembuat: "Ahmad Rizki",
      isRead: false
    },
    {
      id: 3,
      title: "Rapat Mingguan Divisi",
      time: "09:30 Am",
      category: "Notulensi Rapat Rutin",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noNotulensi: "NOT/003/RUT/01/2026",
      tanggalNotulen: "09/01/2026",
      tanggalSelesai: "10/01/2026",
      rapat: "Ruang Rapat A",
      judulNotulen: "Rapat Mingguan IT Divisi",
      pembuat: "Budi Santoso",
      isRead: true
    },
    {
      id: 4,
      title: "Rapat Strategis",
      time: "15:00 Pm",
      category: "Notulensi Rapat Strategis",
      status: "Ditolak",
      statusColor: "#DC2626",
      statusBadge: "Ditolak",
      noNotulensi: "NOT/004/STR/01/2026",
      tanggalNotulen: "08/01/2026",
      tanggalSelesai: "09/01/2026",
      rapat: "Executive Meeting Room",
      judulNotulen: "Rapat Strategis Perusahaan",
      pembuat: "Dewi Lestari",
      isRead: true
    },
  ];

  const [notulensiItems, setNotulensiItems] = useState<Notulensi[]>(notulensiList);

  const handleNotulensiClick = (notulensi: Notulensi) => {
    // Mark the item as read when clicked
    if (!notulensi.isRead) {
      setNotulensiItems(prevItems =>
        prevItems.map(item =>
          item.id === notulensi.id ? { ...item, isRead: true } : item
        )
      );
    }

    // Toggle: if clicking the same notulensi, close it; otherwise, open the new one
    if (selectedNotulensi?.id === notulensi.id) {
      setSelectedNotulensi(null);
    } else {
      // Update the selected item to have isRead: true
      setSelectedNotulensi({ ...notulensi, isRead: true });
    }
  };

  const handleApprove = () => {
    if (selectedNotulensi) {
      alert(`Notulensi "${selectedNotulensi.title}" telah disetujui`);
      setNotulensiItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedNotulensi.id ? { ...item, status: "Selesai", statusColor: "#10B981", statusBadge: "Selesai" } : item
        )
      );
      setSelectedNotulensi(null);
    }
  };

  const handlePending = () => {
    if (selectedNotulensi) {
      alert(`Notulensi "${selectedNotulensi.title}" ditandai pending`);
      setNotulensiItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedNotulensi.id ? { ...item, status: "Dalam Proses", statusColor: "#F59E0B", statusBadge: "Dalam Proses" } : item
        )
      );
      setSelectedNotulensi(null);
    }
  };

  const handleReject = () => {
    if (selectedNotulensi) {
      const reason = prompt("Alasan penolakan:");
      if (reason) {
        alert(`Notulensi "${selectedNotulensi.title}" ditolak dengan alasan: ${reason}`);
        setNotulensiItems(prevItems =>
          prevItems.map(item =>
            item.id === selectedNotulensi.id ? { ...item, status: "Ditolak", statusColor: "#DC2626", statusBadge: "Ditolak" } : item
          )
        );
        setSelectedNotulensi(null);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarApprover
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
            selectedNotulensi ? 'grid-cols-1 lg:grid-cols-[350px_1fr]' : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {/* Left Side - Notulensi List */}
            <div className={`flex flex-col h-full ${selectedNotulensi ? 'lg:max-w-[350px]' : ''}`}>
              {/* Search and Filter */}
              <div className="flex gap-3 mb-4 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari notulensi, no notulensi ..."
                    className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[12px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>
                <button className="p-3 border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors flex-shrink-0">
                  <Filter size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Notulensi List */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {notulensiItems.map((notulensi) => {
                  const leftBorderColor = !notulensi.isRead ? '#3B82F6' : 'transparent';

                  return (
                    <div
                      key={notulensi.id}
                      onClick={() => handleNotulensiClick(notulensi)}
                      className="bg-white rounded-[15px] p-4 border-l-[6px] border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:!border-[#60A5FA] hover:!border-l-[6px] hover:!border-t-[2px] hover:!border-r-[2px] hover:!border-b-[2px]"
                      style={{ borderLeftColor: leftBorderColor }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-sm">
                          {notulensi.title}
                        </h3>
                        <span className="font-['Poppins'] text-xs text-gray-500">
                          {notulensi.time}
                        </span>
                      </div>
                      <p className="font-['Poppins'] text-xs text-gray-600 mb-2">
                        {notulensi.category}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ backgroundColor: notulensi.statusColor + '20', color: notulensi.statusColor }}
                        >
                          {notulensi.statusBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Detail or Empty State */}
            <div className="bg-white rounded-[20px] shadow-sm p-6 lg:p-8 h-full overflow-y-auto">
              {selectedNotulensi ? (
                <div>
                  {/* Header */}
                  <h2 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e] mb-6">
                    Detail Notulensi
                  </h2>

                  {/* Detail Information */}
                  <div className="bg-white border border-gray-200 rounded-[15px] p-6 mb-6">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        No.Notulensi
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.noNotulensi}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Judul Notulen
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.judulNotulen}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Pembuat
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.pembuat}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Tanggal Notulen
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.tanggalNotulen}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Tanggal Selesai
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.tanggalSelesai}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Status
                      </p>
                      <span
                        className="inline-block px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                        style={{ backgroundColor: selectedNotulensi.statusColor + '20', color: selectedNotulensi.statusColor }}
                      >
                        {selectedNotulensi.statusBadge}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Kategori
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.category}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Rapat
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedNotulensi.rapat}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-6">
                  <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                    <Archive size={18} />
                    Arsip Notulensi
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                    <Download size={18} />
                    Unduh Notulensi
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
                      {selectedNotulensi.judulNotulen}
                    </h3>
                    <p className="font-['Poppins'] text-lg text-[#1e1e1e] mb-8">
                      {selectedNotulensi.rapat}
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
                      Pilih notulensi untuk melihat detail!
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-['Poppins'] font-semibold text-xl">Log History</h2>
              <button
                onClick={() => setIsLogHistoryOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
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
