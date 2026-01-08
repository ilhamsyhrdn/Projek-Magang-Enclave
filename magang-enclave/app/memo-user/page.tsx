"use client";

import { useState, useEffect } from "react";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu, Search, Filter, Plus, FileText, Download, Archive, History, X } from "lucide-react";
import Image from "next/image";

interface Memo {
  id: number;
  title: string;
  time: string;
  category: string;
  status: string;
  statusColor: string;
  statusBadge: string;
  noMemo: string;
  tanggalMemo: string;
  tanggalSelesai: string;
  perihal: string;
  tujuan: string;
  divisiDepartemen: string;
  isRead: boolean;
}

export default function MemoUserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);
  const [memoItems, setMemoItems] = useState<Memo[]>([]);

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Surat ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Surat telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Surat telah Dibuat oleh Budiono Siregar", detail: "Tolong revisi bagian isinya ya" },
  ];

  const memoList: Memo[] = [
    {
      id: 1,
      title: "Memo Pengajuan Dana",
      time: "13:00 Pm",
      category: "Risalah Internal iFest",
      status: "Menunggu",
      statusColor: "#6B7280",
      statusBadge: "Menunggu",
      noMemo: "01/M111/12/2025",
      tanggalMemo: "06/12/2025",
      tanggalSelesai: "06/12/2025",
      perihal: "Memo Pengajuan Dana Kegiatan",
      tujuan: "Pengajuan Dana Event iFest 2025",
      divisiDepartemen: "Dept. Keuangan",
      isRead: false
    },
    {
      id: 2,
      title: "Memo Permohonan Izin",
      time: "14:00 Pm",
      category: "Risalah Internal iFest",
      status: "Menunggu",
      statusColor: "#6B7280",
      statusBadge: "Menunggu",
      noMemo: "02/M111/12/2025",
      tanggalMemo: "06/12/2025",
      tanggalSelesai: "06/12/2025",
      perihal: "Memo Permohonan Izin Kegiatan",
      tujuan: "Pengajuan Izin Penggunaan Ruangan",
      divisiDepartemen: "Dept. Hubungan Internal",
      isRead: true
    },
    {
      id: 3,
      title: "Memo Laporan Kegiatan",
      time: "15:00 Pm",
      category: "Risalah Internal iFest",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noMemo: "03/M111/12/2025",
      tanggalMemo: "06/12/2025",
      tanggalSelesai: "06/12/2025",
      perihal: "Memo Laporan Kegiatan Divisi",
      tujuan: "Pengajuan Laporan Bulanan",
      divisiDepartemen: "Dept. Pengembangan Organisasi",
      isRead: true
    },
    {
      id: 4,
      title: "Memo Koordinasi",
      time: "16:00 Pm",
      category: "Risalah Internal iFest",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noMemo: "04/M111/12/2025",
      tanggalMemo: "06/12/2025",
      tanggalSelesai: "06/12/2025",
      perihal: "Memo Koordinasi Antar Divisi",
      tujuan: "Pengajuan Koordinasi Event",
      divisiDepartemen: "Dept. Hubungan Eksternal",
      isRead: true
    },
    {
      id: 5,
      title: "Memo Persetujuan",
      time: "17:00 Pm",
      category: "Risalah Internal iFest",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noMemo: "05/M111/12/2025",
      tanggalMemo: "06/12/2025",
      tanggalSelesai: "06/12/2025",
      perihal: "Memo Persetujuan Proposal",
      tujuan: "Pengajuan Persetujuan Kegiatan",
      divisiDepartemen: "Dept. Keilmuan",
      isRead: true
    },
  ];

  // Initialize memoItems with memoList on component mount
  useEffect(() => {
    setMemoItems(memoList);
  }, []);

  const handleMemoClick = (memo: Memo) => {
    // Mark the item as read when clicked
    if (!memo.isRead) {
      setMemoItems(prevItems =>
        prevItems.map(item =>
          item.id === memo.id ? { ...item, isRead: true } : item
        )
      );
    }

    if (selectedMemo?.id === memo.id) {
      setSelectedMemo(null);
    } else {
      // Update the selected item to have isRead: true
      setSelectedMemo({ ...memo, isRead: true });
    }
  };

  const handleCloseDetail = () => {
    setSelectedMemo(null);
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
            selectedMemo ? 'grid-cols-1 lg:grid-cols-[350px_1fr]' : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {/* Left Side - Memo List */}
            <div className={`flex flex-col h-full ${selectedMemo ? 'lg:max-w-[350px]' : ''}`}>
              {/* Search and Filter */}
              <div className="flex gap-3 mb-4 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari memo, no memo ..."
                    className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[12px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>
                <button className="p-3 border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors flex-shrink-0">
                  <Filter size={20} className="text-gray-600" />
                </button>
                <button className="p-3 bg-[#4180a9] text-white rounded-[12px] hover:bg-[#356890] transition-colors flex-shrink-0">
                  <Plus size={20} />
                </button>
              </div>

              {/* Memo List */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {memoItems.map((memo) => {
                  const leftBorderColor = !memo.isRead ? '#3B82F6' : 'transparent';

                  return (
                    <div
                      key={memo.id}
                      onClick={() => handleMemoClick(memo)}
                      className="bg-white rounded-[15px] p-4 border-l-[6px] border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:!border-[#60A5FA] hover:!border-l-[6px] hover:!border-t-[2px] hover:!border-r-[2px] hover:!border-b-[2px]"
                      style={{ borderLeftColor: leftBorderColor }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-sm">
                          {memo.title}
                        </h3>
                        <span className="font-['Poppins'] text-xs text-gray-500">
                          {memo.time}
                        </span>
                      </div>
                      <p className="font-['Poppins'] text-xs text-gray-600 mb-2">
                        {memo.category}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-2.5 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ 
                            backgroundColor: memo.status === 'Selesai' ? memo.statusColor : memo.statusColor === '#6B7280' ? '#E5E7EB' : '#FEF3C7',
                            color: memo.status === 'Selesai' ? '#FFFFFF' : memo.statusColor === '#6B7280' ? '#374151' : '#92400E'
                          }}
                        >
                          {memo.statusBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Detail or Empty State */}
            <div className="bg-white rounded-[20px] shadow-sm p-6 lg:p-8 h-full overflow-y-auto">
              {selectedMemo ? (
                <div>
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e]">
                      Detail Memo
                    </h2>
                    <button
                      onClick={handleCloseDetail}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Detail Information */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        No.Memo
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.noMemo}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Tujuan
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.tujuan}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Status
                      </p>
                      <span
                        className="inline-block px-2.5 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                        style={{ backgroundColor: selectedMemo.statusColor + '20', color: selectedMemo.statusColor }}
                      >
                        {selectedMemo.statusBadge}
                      </span>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Tanggal Memo
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.tanggalMemo}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Tanggal Selesai
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.tanggalSelesai}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Divisi/Departemen
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.divisiDepartemen}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Kategori
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.category}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-['Poppins'] text-xs font-semibold text-[#1e1e1e] mb-1">
                        Perihal
                      </p>
                      <p className="font-['Poppins'] text-xs text-gray-600">
                        {selectedMemo.perihal}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] font-['Poppins'] text-xs hover:bg-gray-50 transition-colors">
                      <Archive size={16} />
                      Arsip Memo
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] font-['Poppins'] text-xs hover:bg-gray-50 transition-colors">
                      <Download size={16} />
                      Unduh Memo
                    </button>
                    <button 
                      onClick={() => setIsLogHistoryOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] font-['Poppins'] text-xs hover:bg-gray-50 transition-colors ml-auto"
                    >
                      <History size={16} />
                      Log History
                    </button>
                  </div>

                  {/* Document Preview */}
                  <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-8 flex flex-col items-center justify-center min-h-[500px] bg-gray-50">
                    <div className="text-center">
                      <h3 className="font-['Poppins'] font-semibold text-2xl text-[#1e1e1e] mb-4">
                        {selectedMemo.title}
                      </h3>
                      <p className="font-['Poppins'] text-lg text-[#1e1e1e] mb-8">
                        {selectedMemo.tujuan}
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
                      Pilih memo untuk melihat detail!
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
