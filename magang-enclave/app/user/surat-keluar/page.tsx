"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu, Search, Filter, Plus, FileText, Download, Archive, History, X, Send, ChevronRight, Upload, Calendar, Edit2, Trash2, FileCheck, FilePlus } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">Loading editor...</div>
});

interface Surat {
  id: number;
  no_surat: string;
  instansi_penerima: string;
  pengguna_surat_keluar: string;
  tanggal_surat: string;
  diterima_tanggal: string | null;
  perihal: string;
  priority: string;
  status_surat: string;
  is_read: boolean;
  category_name?: string;
  template_name?: string;
  division_name?: string;
  content?: string;
}

interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
  module_type: string;
  division_id: number;
  division_name?: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category_id: number;
  division_id: number;
  content?: string;
}

export default function SuratKeluarUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isLogHistoryOpen, setIsLogHistoryOpen] = useState(false);
  const [suratItems, setSuratItems] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isInformasiSuratOpen, setIsInformasiSuratOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<Category | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    instansiPenerima: "",
    tanggalDibuat: "",
    perihal: "",
    lampiranTersedia: "Lampiran pada dokumen",
    sifat: "Pilih urgensi dokumen",
    content: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isKonfirmasiOpen, setIsKonfirmasiOpen] = useState(false);
  const [konfirmasiData, setKonfirmasiData] = useState({
    notes: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logHistory = [
    { id: 1, tanggal: "1 Januari 2025 | 19:00", aksi: "Surat ditolak oleh Chandra wibawa", detail: "---" },
    { id: 2, tanggal: "30 Desember 2025 | 13:00", aksi: "Dilakukan revisi oleh Budiono Siregar", detail: "Surat telah direvisi" },
    { id: 3, tanggal: "28 Desember 2025 | 12:00", aksi: "Diminta revisi oleh Chandra Wibawa", detail: "Tolong revisi bagian isinya ya" },
    { id: 4, tanggal: "25 Desember 2025 | 10:00", aksi: "Surat telah Dibuat oleh Budiono Siregar", detail: "Tolong revisi bagian isinya ya" },
  ];

  // Fetch surat keluar data
  useEffect(() => {
    fetchSuratKeluar();
  }, []);

  // Auto-open detail from notification
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && suratItems.length > 0) {
      const surat = suratItems.find(s => s.id === parseInt(id));
      if (surat) {
        setSelectedSurat(surat);
        markAsRead(surat.id);
      }
    }
  }, [searchParams, suratItems]);

  const fetchSuratKeluar = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/surat-keluar');
      const data = await response.json();

      if (data.success) {
        setSuratItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching surat keluar:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/user/surat-keluar/${id}/read`, {
        method: 'PATCH'
      });
      setSuratItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // Hapus division_id dari query parameter karena sekarang otomatis dari backend
      const response = await fetch('/api/user/categories?module_type=surat_keluar');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        console.error('Error fetching categories:', data.error);
        alert(data.error || 'Gagal mengambil kategori');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Gagal mengambil kategori');
    }
  };

  const fetchTemplates = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/admin/templates?category_id=${categoryId}&module_type=surat_keluar`);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleOpenKategoriModal = () => {
    fetchCategories();
    setIsKategoriModalOpen(true);
  };

  const handleSuratClick = (surat: Surat) => {
    if (!surat.is_read) {
      markAsRead(surat.id);
    }

    if (selectedSurat?.id === surat.id) {
      setSelectedSurat(null);
    } else {
      setSelectedSurat({ ...surat, is_read: true });
    }
  };

  const handleCloseDetail = () => {
    setSelectedSurat(null);
  };

  const handleDownload = () => {
    if (selectedSurat) {
      alert(`Mengunduh surat: ${selectedSurat.no_surat}`);
    }
  };

  const handleArsip = () => {
    if (selectedSurat) {
      router.push('/user/arsip/surat-keluar');
    }
  };

  const handleFileUpload = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (file.size > maxSize) {
      alert('Ukuran file terlalu besar. Maksimal 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipe file tidak didukung. Hanya JPG/PNG/PDF yang diperbolehkan');
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

  const handleKategoriSelect = (kategori: Category) => {
    setSelectedKategori(kategori);
    setIsKategoriModalOpen(false);
    fetchTemplates(kategori.id);
    setIsTemplateModalOpen(true);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    setFormData(prev => ({
      ...prev,
      content: template.content || ''
    }));
    setIsInformasiSuratOpen(true);
  };

  const handleFormSubmit = async () => {
    // Validate required fields
    if (!formData.instansiPenerima || !formData.tanggalDibuat || !formData.perihal) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (formData.sifat === 'Pilih urgensi dokumen') {
      alert('Mohon pilih sifat/urgensi dokumen');
      return;
    }

    // Open editor modal
    setIsInformasiSuratOpen(false);
    setIsEditorModalOpen(true);
  };

  const handleEditorSave = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    setIsEditorModalOpen(false);
    setIsKonfirmasiOpen(true);
  };

  const handleDeleteSurat = async () => {
    if (!selectedSurat) return;

    try {
      const response = await fetch(`/api/user/surat-keluar/${selectedSurat.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Surat berhasil dihapus');
        setIsDeleteModalOpen(false);
        setSelectedSurat(null);
        fetchSuratKeluar();
      } else {
        alert(data.error || 'Gagal menghapus surat');
      }
    } catch (error) {
      console.error('Error deleting surat:', error);
      alert('Gagal menghapus surat');
    }
  };

  const handleFinalSubmit = async () => {
    if (!konfirmasiData.notes) {
      alert('Mohon lengkapi notes');
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData: any = {
        instansi_penerima: formData.instansiPenerima,
        tanggal_dibuat: formData.tanggalDibuat,
        perihal: formData.perihal,
        category_id: selectedKategori?.id,
        template_id: selectedTemplate?.id,
        content: formData.content,
        priority: formData.sifat === 'High Priority' ? 'HIGH' :
                  formData.sifat === 'Medium Priority' ? 'MEDIUM' : 'LOW',
        lampiran: formData.lampiranTersedia === 'Ya' ? true : false,
        notes: konfirmasiData.notes
      };

      const response = await fetch('/api/user/surat-keluar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Surat berhasil dibuat dan dikirim untuk persetujuan!');
        // Reset all forms
        setFormData({
          instansiPenerima: '',
          tanggalDibuat: '',
          perihal: '',
          lampiranTersedia: 'Lampiran pada dokumen',
          sifat: 'Pilih urgensi dokumen',
          content: ''
        });
        setKonfirmasiData({ notes: '', password: '' });
        setUploadedFile(null);
        setSelectedKategori(null);
        setSelectedTemplate(null);
        setIsKonfirmasiOpen(false);
        fetchSuratKeluar();
      } else {
        alert(data.error || 'Gagal membuat surat');
      }
    } catch (error) {
      console.error('Error creating surat keluar:', error);
      alert('Gagal membuat surat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'DRAFT': { label: 'Draft', color: '#6B7280' },
      'PENDING': { label: 'Dalam Proses', color: '#F59E0B' },
      'PROCES': { label: 'Dalam Proses', color: '#F59E0B' },
      'FINISHED': { label: 'Selesai', color: '#10B981' }
    };

    const statusInfo = statusMap[status] || { label: status, color: '#6B7280' };
    return { badge: statusInfo.label, color: statusInfo.color };
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; color: string }> = {
      'HIGH': { label: 'High Priority', color: '#DC2626' },
      'MEDIUM': { label: 'Medium Priority', color: '#F59E0B' },
      'LOW': { label: 'Low Priority', color: '#10B981' }
    };

    return priorityMap[priority] || { label: priority, color: '#6B7280' };
  };

  const filteredSurat = suratItems.filter(surat =>
    surat.no_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surat.instansi_penerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surat.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surat.pengguna_surat_keluar.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  onClick={handleOpenKategoriModal}
                  className="p-3 bg-[#4180a9] text-white rounded-[12px] hover:bg-[#356890] transition-colors flex-shrink-0"
                  title="Buat Surat Keluar Baru"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Surat List */}
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500 font-['Poppins']">Loading...</div>
                  </div>
                ) : filteredSurat.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <FileText size={48} className="mb-4 text-gray-300" />
                    <p className="font-['Poppins']">Tidak ada surat keluar</p>
                  </div>
                ) : (
                  filteredSurat.map((surat) => {
                    const statusInfo = getStatusBadge(surat.status_surat);
                    const priorityInfo = getPriorityBadge(surat.priority);
                    const leftBorderColor = !surat.is_read ? '#3B82F6' : 'transparent';

                    return (
                      <div
                        key={surat.id}
                        onClick={() => handleSuratClick(surat)}
                        className="bg-white rounded-[15px] p-3 border-l-[4px] shadow-md hover:shadow-lg transition-all cursor-pointer"
                        style={{ borderLeftColor: leftBorderColor }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-sm">
                            {surat.instansi_penerima}
                          </h3>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-['Poppins'] text-xs text-gray-500">
                              {surat.tanggal_surat}
                            </span>
                          </div>
                        </div>
                        <p className="font-['Poppins'] text-xs text-gray-600 mb-1">
                          {surat.perihal}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                            style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}
                          >
                            {statusInfo.badge}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full font-['Poppins'] text-[10px] font-medium"
                            style={{ backgroundColor: priorityInfo.color + '20', color: priorityInfo.color }}
                          >
                            {priorityInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                          {selectedSurat.no_surat}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Instansi Penerima
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.instansi_penerima}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Pengaju Surat Keluar
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.pengguna_surat_keluar}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Tanggal Surat
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.tanggal_surat}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Diterima Tanggal
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.diterima_tanggal || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Status
                        </p>
                        <span
                          className="inline-block px-3 py-1 rounded-full font-['Poppins'] text-xs font-medium"
                          style={{
                            backgroundColor: getStatusBadge(selectedSurat.status_surat).color + '20',
                            color: getStatusBadge(selectedSurat.status_surat).color
                          }}
                        >
                          {getStatusBadge(selectedSurat.status_surat).badge}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p className="font-['Poppins'] text-sm font-semibold text-[#1e1e1e] mb-1">
                          Kategori
                        </p>
                        <p className="font-['Poppins'] text-sm text-gray-600">
                          {selectedSurat.category_name || '-'}
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
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
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
                    <button
                      onClick={handleArsip}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[#4180a9] text-[#4180a9] rounded-[10px] font-['Poppins'] text-sm hover:bg-[#4180a9] hover:text-white transition-colors"
                    >
                      <Archive size={18} />
                      Arsip
                    </button>
                    {selectedSurat.status_surat === 'DRAFT' && (
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-red-500 text-red-500 rounded-[10px] font-['Poppins'] text-sm hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={18} />
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* Document Preview */}
                  <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-8 flex flex-col items-center justify-center min-h-[500px] bg-gray-50">
                    <div className="text-center w-full">
                      <h3 className="font-['Poppins'] font-semibold text-2xl text-[#1e1e1e] mb-4">
                        {selectedSurat.instansi_penerima}
                      </h3>
                      <p className="font-['Poppins'] text-lg text-[#1e1e1e] mb-8">
                        {selectedSurat.perihal}
                      </p>
                      {selectedSurat.content && (
                        <div
                          className="text-left"
                          dangerouslySetInnerHTML={{ __html: selectedSurat.content }}
                        />
                      )}
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
                {categories.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 font-['Poppins']">
                    Tidak ada kategori tersedia
                  </div>
                ) : (
                  categories.map((kategori) => (
                    <div
                      key={kategori.id}
                      onClick={() => handleKategoriSelect(kategori)}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="font-['Poppins'] text-sm text-gray-900">{kategori.name}</div>
                      <div className="font-['Poppins'] text-sm text-gray-900">{kategori.code}</div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))
                )}
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
                <div className="font-['Poppins'] font-semibold text-sm">Nama Template</div>
                <div className="font-['Poppins'] font-semibold text-sm">Deskripsi</div>
                <div className="w-6"></div>
              </div>

              {/* Table Body */}
              <div>
                {templates.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 font-['Poppins']">
                    Tidak ada template tersedia
                  </div>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="font-['Poppins'] text-sm text-gray-900">{template.name}</div>
                      <div className="font-['Poppins'] text-sm text-gray-900">{template.description || '-'}</div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[1000px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
              <h2 className="font-['Poppins'] font-semibold text-[22px] text-[#19537C]">
                Edit Konten Surat
              </h2>
              <button
                onClick={() => setIsEditorModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setIsEditorModalOpen(false)}
                className="px-8 py-2.5 bg-red-600 text-white rounded-[10px] font-['Poppins'] text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleEditorSave(formData.content)}
                className="px-8 py-2.5 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] text-sm font-medium hover:bg-[#356890] transition-colors"
              >
                Simpan & Lanjut
              </button>
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
                  Demi keamanan, setiap aksi persetujuan memerlukan verifikasi akun. Masukkan catatan sebelum melanjutkan proses
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
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Memproses...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Konfirmasi */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Surat</h3>
                <p className="text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSurat}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
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
                      Sifat<span className="text-red-500">*</span>
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
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
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
                            JPG/PNG/PDF (Max : 5 Mb)
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
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}