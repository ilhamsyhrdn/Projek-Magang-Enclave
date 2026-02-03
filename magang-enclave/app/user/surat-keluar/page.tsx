"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu, Search, Filter, Plus, FileText, Download, Archive, History, X, Send, ChevronRight, Upload, Calendar } from "lucide-react";
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

export default function SuratKeluarUserPage() {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);
  const [suratItems, setSuratItems] = useState<Surat[]>([]);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isInformasiSuratOpen, setIsInformasiSuratOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [formData, setFormData] = useState({
    instansiPenerima: "",
    tanggalDibuat: "",
    perihal: "",
    lampiranTersedia: "Lampiran pada dokumen",
    sifat: "Pilih urgensi dokumen"
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isKonfirmasiOpen, setIsKonfirmasiOpen] = useState(false);
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

  const suratList: Surat[] = [
    {
      id: 1,
      title: "Pt Lorem Ipsum",
      time: "13:00 Pm",
      category: "Surat Keluar - POP",
      status: "Dalam proses",
      statusColor: "#F59E0B",
      statusBadge: "Dalam Proses",
      noSurat: "01/C111/107/11/2025",
      tanggalSurat: "03/11/2025",
      diterimaTanggal: "06/12/2025",
      perihal: "Surat Keluar - POP",
      priority: 'high',
      priorityBadge: 'High Priority',
      instansiPenerima: "BEM Universitas Padjajaran",
      penggunaSuratKeluar: "Chandra Wibawa",
      isRead: false
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
      isRead: true
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

  useEffect(() => {
    setSuratItems(suratList);

    // Auto-open detail from notification
    const id = searchParams.get('id');
    if (id) {
      const surat = suratList.find(s => s.id === parseInt(id));
      if (surat) {
        setSelectedSurat(surat);
        if (!surat.isRead) {
          setSuratItems(prevItems =>
            prevItems.map(item =>
              item.id === surat.id ? { ...item, isRead: true } : item
            )
          );
        }
      }
    }
  }, [searchParams]);

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

  const handleFileUpload = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (file.size > maxSize) {
      alert('Ukuran file terlalu besar. Maksimal 5MB');
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
    if (!formData.instansiPenerima || !formData.tanggalDibuat || !formData.perihal) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Close Informasi Surat modal and open confirmation modal
    setIsInformasiSuratOpen(false);
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
    console.log('Kategori:', selectedKategori);
    console.log('Template:', selectedTemplate);
    console.log('Konfirmasi:', konfirmasiData);

    alert('Surat berhasil dibuat dan dikirim untuk persetujuan!');

    // Reset all forms
    setFormData({
      instansiPenerima: '',
      tanggalDibuat: '',
      perihal: '',
      lampiranTersedia: 'Lampiran pada dokumen',
      sifat: 'Pilih urgensi dokumen'
    });
    setKonfirmasiData({
      notes: '',
      password: ''
    });
    setUploadedFile(null);
    setIsKonfirmasiOpen(false);
    setIsInformasiSuratOpen(false);
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
                <button
                  onClick={() => setIsKategoriModalOpen(true)}
                  className="p-3 bg-[#4180a9] text-white rounded-[12px] hover:bg-[#356890] transition-colors flex-shrink-0"
                >
                  <Plus size={20} />
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
                      onClick={() => {
                        // Create a dummy PDF download
                        const link = document.createElement('a');
                        link.href = '/logo-enclave.png'; // Replace with actual PDF URL
                        link.download = `Surat-Keluar-${selectedSurat.noSurat}.pdf`;
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
                    <button
                      onClick={async () => {
                        try {
                          // Convert date format from DD/MM/YYYY to YYYY-MM-DD
                          const dateParts = selectedSurat.tanggalSurat.split('/');
                          const formattedDate = dateParts.length === 3
                            ? `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
                            : new Date().toISOString().split('T')[0];

                          const response = await fetch('/api/user/arsip', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              documentId: selectedSurat.id,
                              documentType: 'Surat Keluar',
                              documentNumber: selectedSurat.noSurat,
                              title: selectedSurat.perihal,
                              content: selectedSurat.perihal,
                              category: selectedSurat.category,
                              divisionId: null,
                              departmentId: null,
                              documentDate: formattedDate,
                              archivedBy: 1 // Replace with actual user ID from session
                            }),
                          });

                          if (response.ok) {
                            alert('Surat berhasil diarsipkan!');
                            window.location.href = '/user/arsip';
                          } else {
                            alert('Gagal mengarsipkan surat');
                          }
                        } catch (error) {
                          console.error('Error archiving document:', error);
                          alert('Terjadi kesalahan saat mengarsipkan surat');
                        }
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors"
                    >
                      <Archive size={18} />
                      Arsip
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors">
                      <Send size={18} />
                      Balas Surat
                    </button>
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

      {/* Kategori Dokumen Modal */}
      {isKategoriModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[600px] max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#19537C]">
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
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 bg-[#19537C] text-white">
                <div className="font-['Poppins'] font-semibold text-sm">Nama Kategori</div>
                <div className="font-['Poppins'] font-semibold text-sm">Kode Surat</div>
                <div className="w-6"></div>
              </div>

              {/* Table Body */}
              <div>
                {kategoriDokumen.map((kategori) => (
                  <div
                    key={kategori.id}
                    onClick={() => {
                      setSelectedKategori(kategori.nama);
                      setIsKategoriModalOpen(false);
                      setIsTemplateModalOpen(true);
                    }}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="font-['Poppins'] text-sm text-gray-900">{kategori.nama}</div>
                    <div className="font-['Poppins'] text-sm text-gray-900">{kategori.kode}</div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Dokumen Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[600px] max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#19537C]">
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
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 bg-[#19537C] text-white">
                <div className="font-['Poppins'] font-semibold text-sm">Nama Kategori</div>
                <div className="font-['Poppins'] font-semibold text-sm">Deskripsi Template</div>
                <div className="w-6"></div>
              </div>

              {/* Table Body */}
              <div>
                {templateDokumen.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.nama);
                      setIsTemplateModalOpen(false);
                      setIsInformasiSuratOpen(true);
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

      {/* Informasi Surat Modal */}
      {isInformasiSuratOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#19537C]">
                Informasi Surat
              </h2>
              <button
                onClick={() => setIsInformasiSuratOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 160px)' }}>
              <div className="space-y-5">
                {/* Instansi Penerima */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Instansi Penerima<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.instansiPenerima}
                    onChange={(e) => setFormData({...formData, instansiPenerima: e.target.value})}
                    placeholder="Masukan nama instansi..."
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Tanggal Dibuat */}
                <div>
                  <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                    Tanggal Dibuat<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2099-12-31"
                    value={formData.tanggalDibuat}
                    onChange={(e) => setFormData({...formData, tanggalDibuat: e.target.value})}
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
                    placeholder="Kesepakatan Kerja - HRD"
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  />
                </div>

                {/* Lampiran Tersedia & Sifat */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                      Lampiran Tersedia
                    </label>
                    <select
                      value={formData.lampiranTersedia}
                      onChange={(e) => setFormData({...formData, lampiranTersedia: e.target.value})}
                      className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] appearance-none bg-white"
                      style={{ color: formData.lampiranTersedia === 'Lampiran pada dokumen' ? '#9CA3AF' : '#1e1e1e' }}
                    >
                      <option value="Lampiran pada dokumen" style={{ color: '#0066A1', backgroundColor: '#E6F2FF' }}>Lampiran pada dokumen</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-['Poppins'] text-sm font-medium text-gray-900 mb-2 block">
                      Sifat
                    </label>
                    <select
                      value={formData.sifat}
                      onChange={(e) => setFormData({...formData, sifat: e.target.value})}
                      className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] appearance-none bg-white"
                      style={{ color: formData.sifat === 'Pilih urgensi dokumen' ? '#9CA3AF' : '#1e1e1e' }}
                    >
                      <option value="Pilih urgensi dokumen" style={{ color: '#0066A1', backgroundColor: '#E6F2FF' }}>Pilih urgensi dokumen</option>
                      <option value="High Priority" style={{ color: '#DC2626' }}>High Priority</option>
                      <option value="Medium Priority" style={{ color: '#F59E0B' }}>Medium Priority</option>
                      <option value="Low Priority" style={{ color: '#10B981' }}>Low Priority</option>
                    </select>
                  </div>
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
                    id="file-upload"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-[10px] p-8 text-center transition-colors cursor-pointer ${
                      isDragging ? 'border-[#4180a9] bg-blue-50' : 'border-gray-300'
                    }`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                      {uploadedFile ? (
                        <div className="text-center">
                          <p className="font-['Poppins'] text-sm text-green-600 mb-1">
                            ✓ {uploadedFile.name}
                          </p>
                          <p className="font-['Poppins'] text-xs text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                            className="mt-2 text-xs text-red-500 hover:text-red-700"
                          >
                            Hapus file
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-['Poppins'] text-sm text-gray-600 mb-1">
                            Drag & Drop or <span className="text-[#4180a9] cursor-pointer">Choose File</span> to upload
                          </p>
                          <p className="font-['Poppins'] text-xs text-gray-500">
                            Jpg (Max : 5 Mb)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsInformasiSuratOpen(false);
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
