"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarUser from "@/app/components/sidebar-user";
import RichTextEditor from "@/app/components/RichTextEditor";
import { Menu, Search, Filter, Plus, FileText, Download, Archive, History, X, Send, ChevronRight, Calendar, Upload } from "lucide-react";
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
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);
  const [memoItems, setMemoItems] = useState<Memo[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isFormMemoOpen, setIsFormMemoOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isKonfirmasiOpen, setIsKonfirmasiOpen] = useState(false);
  const [formData, setFormData] = useState({
    unit: "Pilih unit",
    tanggalDibuat: "",
    perihal: "",
    isiMemo: ""
  });
  const [konfirmasiData, setKonfirmasiData] = useState({
    notes: "",
    password: ""
  });

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
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
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
      status: "Dalam Proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
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

  useEffect(() => {
    setMemoItems(memoList);

    // Auto-open detail from notification
    const id = searchParams.get('id');
    if (id) {
      const memo = memoList.find(m => m.id === parseInt(id));
      if (memo) {
        setSelectedMemo(memo);
        if (!memo.isRead) {
          setMemoItems(prevItems =>
            prevItems.map(item =>
              item.id === memo.id ? { ...item, isRead: true } : item
            )
          );
        }
      }
    }
  }, [searchParams]);

  const handleMemoClick = (memo: Memo) => {
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
      setSelectedMemo({ ...memo, isRead: true });
    }
  };

  const handleCloseDetail = () => {
    setSelectedMemo(null);
  };

  const templateMemo = [
    { id: 1, nama: "Internal Memo - PTI", deskripsi: "Pengembangan Informasi..." },
    { id: 2, nama: "Internal Memo - Hubin & Hubex", deskripsi: "Internal & External" },
    { id: 3, nama: "Internal Memo - Kaderiasi", deskripsi: "Kaderiasi" },
    { id: 4, nama: "Internal Memo - Kewirausahaan", deskripsi: "Kewirausahaan" },
    { id: 5, nama: "Internal Memo - Keuangan", deskripsi: "Keuangan" },
    { id: 6, nama: "Surat Kuasa", deskripsi: "404" },
  ];

  const handleFileUpload = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipe file tidak didukung. Hanya JPG/PNG yang diperbolehkan');
      return;
    }

    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFormSubmit = () => {
    // Validate required fields
    if (!formData.tanggalDibuat || !formData.perihal || !formData.isiMemo) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Close Form Memo modal and open confirmation modal
    setIsFormMemoOpen(false);
    setIsKonfirmasiOpen(true);
  };

  const handleFinalSubmit = () => {
    // Validate confirmation fields
    if (!konfirmasiData.notes || !konfirmasiData.password) {
      alert('Mohon lengkapi notes dan password');
      return;
    }

    // Here you would typically send the data to your API
    console.log('Form Data:', formData);
    console.log('Uploaded File:', uploadedFile);
    console.log('Template:', selectedTemplate);
    console.log('Konfirmasi:', konfirmasiData);

    alert('Memo berhasil dibuat dan dikirim untuk persetujuan!');

    // Reset all forms
    setFormData({
      unit: 'Pilih unit',
      tanggalDibuat: '',
      perihal: '',
      isiMemo: ''
    });
    setKonfirmasiData({
      notes: '',
      password: ''
    });
    setUploadedFile(null);
    setIsKonfirmasiOpen(false);
    setIsFormMemoOpen(false);
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
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="p-3 bg-[#4180a9] text-white rounded-[12px] hover:bg-[#356890] transition-colors flex-shrink-0"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Memo List */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {memoItems.filter(memo =>
                  memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  memo.noMemo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  memo.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  memo.tujuan.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((memo) => {
                  const leftBorderColor = !memo.isRead ? '#3B82F6' : 'transparent';

                  return (
                    <div
                      key={memo.id}
                      onClick={() => handleMemoClick(memo)}
                      className="bg-white rounded-[15px] p-4 border-l-[4px] shadow-md hover:shadow-lg transition-all cursor-pointer"
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
                          style={{
                            backgroundColor: memo.statusColor + '20',
                            color: memo.statusColor
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
                    <button
                      onClick={() => {
                        // Create a dummy PDF download
                        const link = document.createElement('a');
                        link.href = '/logo-enclave.png'; // Replace with actual PDF URL
                        link.download = `Memo-${selectedMemo.noMemo}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
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
          <div className="bg-white rounded-[15px] w-full max-w-[550px] flex flex-col shadow-2xl" style={{ maxHeight: '85vh' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
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
            <div className="overflow-y-auto flex-1 p-6">
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

      {/* Modal Konfirmasi Persetujuan */}
      {isKonfirmasiOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Persetujuan</h3>
                <p className="text-sm text-gray-600">
                  Demi keamanan, setiap aksi persetujuan memerlukan verifikasi akun. Masukkan password dan catatan sebelum melanjutkan proses
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukan catatan..."
                  value={konfirmasiData.notes}
                  onChange={(e) => setKonfirmasiData({ ...konfirmasiData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Masukan password akun anda..."
                  value={konfirmasiData.password}
                  onChange={(e) => setKonfirmasiData({ ...konfirmasiData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsKonfirmasiOpen(false);
                  setKonfirmasiData({ notes: '', password: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Memo Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[600px] max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#19537C]">
                Pilih Template Memo
              </h2>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 bg-[#19537C] text-white">
                <div className="font-['Poppins'] font-semibold text-sm">Nama Kategori</div>
                <div className="font-['Poppins'] font-semibold text-sm">Deskripsi Template</div>
                <div className="w-6"></div>
              </div>

              {/* Table Body */}
              <div>
                {templateMemo.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.nama);
                      setIsTemplateModalOpen(false);
                      setIsFormMemoOpen(true);
                    }}
                    className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="font-['Poppins'] text-sm text-gray-900">{template.nama}</div>
                    <div className="font-['Poppins'] text-sm text-gray-900">{template.deskripsi}</div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Memo Modal */}
      {isFormMemoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#19537C]">
                Form Memo
              </h2>
              <button
                onClick={() => setIsFormMemoOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 160px)' }}>
              <div className="space-y-5">
                {/* Unit */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Unit<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm text-gray-500 focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] appearance-none bg-white"
                  >
                    <option>Pilih unit</option>
                    <option>Dept. Keuangan</option>
                    <option>Dept. Hubungan Internal</option>
                    <option>Dept. Hubungan Eksternal</option>
                    <option>Dept. Keilmuan</option>
                    <option>Dept. Pengembangan Organisasi</option>
                  </select>
                </div>

                {/* Tanggal Dibuat */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Tanggal Dibuat<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date" value={formData.tanggalDibuat}
                    onChange={(e) => setFormData({...formData, tanggalDibuat: e.target.value})}
                    placeholder="dd/dd/yyyy"
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Perihal */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Perihal<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.perihal}
                    onChange={(e) => setFormData({...formData, perihal: e.target.value})}
                    placeholder="Kesepakatan Kerja"
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Unggah Dokumen */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Unggah Dokumen (Opsional)
                  </label>
                  <p className="font-['Poppins'] text-xs text-gray-500 mb-3">
                    Unggah dokumen pendukung disini jika tersedia
                  </p>

                  <input
                    type="file"
                    id="file-upload-memo"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-[10px] p-6 text-center transition-colors cursor-pointer ${
                      isDragging ? 'border-[#4180a9] bg-blue-50' : 'border-gray-300'
                    }`}
                    onClick={() => document.getElementById('file-upload-memo')?.click()}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Upload size={20} className="text-gray-400" />
                      </div>
                      {uploadedFile ? (
                        <div className="w-full">
                          <p className="font-['Poppins'] text-sm text-gray-900 font-medium mb-1">
                            {uploadedFile.name}
                          </p>
                          <p className="font-['Poppins'] text-xs text-gray-500 mb-2">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Hapus File
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-['Poppins'] text-sm text-gray-600 mb-1">
                            Drag & Drop or <span className="text-[#4180a9]">Choose File</span> to upload
                          </p>
                          <p className="font-['Poppins'] text-xs text-gray-500">
                            Max : 5 Mb
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Isi Memo */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Isi Memo
                  </label>
                  <RichTextEditor
                    value={formData.isiMemo}
                    onChange={(value) => setFormData({...formData, isiMemo: value})}
                    placeholder="Tulis isi memo di sini..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsFormMemoOpen(false);
                  setUploadedFile(null);
                }}
                className="px-8 py-2.5 bg-red-600 text-white rounded-[10px] font-['Poppins'] text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-8 py-2.5 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] text-sm font-medium hover:bg-[#356890] transition-colors"
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


