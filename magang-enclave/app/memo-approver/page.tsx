"use client";

import { useState } from "react";
import SidebarApprover from "@/app/components/sidebar-approver";
import { Menu, Search, Filter, FileText, Download, History, X, Check, Clock, Archive } from "lucide-react";
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

export default function MemoApproverPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Memo ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Memo telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Memo telah Dibuat oleh Budiono Siregar", detail: "Memo telah dibuat" },
  ];

  const memoList: Memo[] = [
    {
      id: 1,
      title: "Memo Kebijakan Baru",
      time: "09:30 Am",
      category: "Memo Internal",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noMemo: "MEM/001/INT/01/2026",
      tanggalMemo: "10/01/2026",
      tanggalSelesai: "12/01/2026",
      perihal: "Implementasi Kebijakan Kerja Hybrid",
      tujuan: "Seluruh Divisi",
      divisiDepartemen: "HRD Department",
      isRead: false
    },
    {
      id: 2,
      title: "Memo Rapat Koordinasi",
      time: "14:15 Pm",
      category: "Memo Rapat",
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noMemo: "MEM/002/RAP/01/2026",
      tanggalMemo: "11/01/2026",
      tanggalSelesai: "12/01/2026",
      perihal: "Undangan Rapat Evaluasi Q4 2025",
      tujuan: "Manager & Supervisor",
      divisiDepartemen: "Direktur Operasional",
      isRead: false
    },
    {
      id: 3,
      title: "Memo Pengumuman",
      time: "11:00 Am",
      category: "Memo Pengumuman",
      status: "Selesai",
      statusColor: "#10B981",
      statusBadge: "Selesai",
      noMemo: "MEM/003/PEN/01/2026",
      tanggalMemo: "09/01/2026",
      tanggalSelesai: "10/01/2026",
      perihal: "Pengumuman Cuti Bersama",
      tujuan: "Seluruh Karyawan",
      divisiDepartemen: "GA Department",
      isRead: true
    },
    {
      id: 4,
      title: "Memo Pemberitahuan",
      time: "16:20 Pm",
      category: "Memo Pemberitahuan",
      status: "Ditolak",
      statusColor: "#DC2626",
      statusBadge: "Ditolak",
      noMemo: "MEM/004/BER/01/2026",
      tanggalMemo: "08/01/2026",
      tanggalSelesai: "09/01/2026",
      perihal: "Perubahan Jam Operasional",
      tujuan: "Semua Staff",
      divisiDepartemen: "Facility Management",
      isRead: true
    },
  ];

  const [memoItems, setMemoItems] = useState<Memo[]>(memoList);

  const handleMemoClick = (memo: Memo) => {
    // Mark the item as read when clicked
    if (!memo.isRead) {
      setMemoItems(prevItems =>
        prevItems.map(item =>
          item.id === memo.id ? { ...item, isRead: true } : item
        )
      );
    }

    // Toggle: if clicking the same memo, close it; otherwise, open the new one
    if (selectedMemo?.id === memo.id) {
      setSelectedMemo(null);
    } else {
      // Update the selected item to have isRead: true
      setSelectedMemo({ ...memo, isRead: true });
    }
  };

  const handleApprove = () => {
    if (selectedMemo) {
      alert(`Memo "${selectedMemo.title}" telah disetujui`);
      setMemoItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedMemo.id ? { ...item, status: "Selesai", statusColor: "#10B981", statusBadge: "Selesai" } : item
        )
      );
      setSelectedMemo(null);
    }
  };

  const handlePending = () => {
    if (selectedMemo) {
      alert(`Memo "${selectedMemo.title}" ditandai pending`);
      setMemoItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedMemo.id ? { ...item, status: "Dalam Proses", statusColor: "#F59E0B", statusBadge: "Dalam Proses" } : item
        )
      );
      setSelectedMemo(null);
    }
  };

  const handleReject = () => {
    if (selectedMemo) {
      const reason = prompt("Alasan penolakan:");
      if (reason) {
        alert(`Memo "${selectedMemo.title}" ditolak dengan alasan: ${reason}`);
        setMemoItems(prevItems =>
          prevItems.map(item =>
            item.id === selectedMemo.id ? { ...item, status: "Ditolak", statusColor: "#DC2626", statusBadge: "Ditolak" } : item
          )
        );
        setSelectedMemo(null);
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
                          className="px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{ backgroundColor: memo.statusColor + '20', color: memo.statusColor }}
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
                  {/* Header */}
                  <h2 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e] mb-6">
                    Detail Memo
                  </h2>

                  {/* Detail Information */}
                  <div className="bg-white border border-gray-200 rounded-[15px] p-6 mb-6">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        No.Memo
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.noMemo}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Tujuan
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.tujuan}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Status
                      </p>
                      <span
                        className="inline-block px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                        style={{ backgroundColor: selectedMemo.statusColor + '20', color: selectedMemo.statusColor }}
                      >
                        {selectedMemo.statusBadge}
                      </span>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Tanggal Memo
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.tanggalMemo}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Tanggal Selesai
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.tanggalSelesai}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Divisi/Departemen
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.divisiDepartemen}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Kategori
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.category}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                        Perihal
                      </p>
                      <p className="font-['Poppins'] text-sm text-gray-600">
                        {selectedMemo.perihal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-6">
                  <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                    <Archive size={18} />
                    Arsip Memo
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                    <Download size={18} />
                    Unduh Memo
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
