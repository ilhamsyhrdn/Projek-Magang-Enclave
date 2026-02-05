"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Search, Edit2, Trash2, Plus, X } from "lucide-react";

interface Category {
  id: number;
  code: string;
  name: string;
  description: string | null;
  module_type: string;
  division_id: number | null;
  department_id: number | null;
  division_name: string | null;
  department_name: string | null;
  created_at: string;
  updated_at: string;
}

interface Division { id: number; name: string; }

export default function KategoriPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    module_type: "surat_masuk",
    division_id: "",
  });

  const moduleTypes = [
    { value: "surat_masuk", label: "Surat Masuk" },
    { value: "surat_keluar", label: "Surat Keluar" },
    { value: "memo", label: "Memo" },
    { value: "notulensi", label: "Notulensi" },
  ];

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, divisionsRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/divisions'),
      ]);

      if (!categoriesRes.ok) throw new Error('Gagal mengambil data kategori');
      if (!divisionsRes.ok) throw new Error('Gagal mengambil data divisi');

      const [categoriesData, divisionsData] = await Promise.all([
        categoriesRes.json(),
        divisionsRes.json(),
      ]);

      setCategories(categoriesData.categories || []);
      setDivisions(divisionsData.divisions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi
    if (!formData.code || !formData.name || !formData.module_type) {
      setError("Kode, Nama, dan Modul wajib diisi");
      return;
    }

    await saveCategory();
  };

  const saveCategory = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const url = isEditMode ? `/api/admin/categories/${editId}` : '/api/admin/categories';
      const method = isEditMode ? 'PUT' : 'POST';

      const body = {
        code: formData.code,
        name: formData.name,
        description: formData.description || null,
        module_type: formData.module_type,
        division_id: formData.division_id ? parseInt(formData.division_id) : null,
        department_id: null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan kategori');

      setSuccess(isEditMode ? 'Kategori berhasil diperbarui!' : 'Kategori berhasil ditambahkan!');
      await fetchAllData();
      handleCloseModal();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description || "",
      module_type: category.module_type,
      division_id: category.division_id?.toString() || "",
    });
    setEditId(category.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Gagal menghapus kategori');

        setSuccess('Kategori berhasil dihapus!');
        await fetchAllData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus kategori';
        setError(errorMessage);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      module_type: "surat_masuk",
      division_id: "",
    });
    setError("");
    setIsSubmitting(false);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.module_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Mobile Menu Button */}
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <span className="sr-only">Toggle menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 lg:px-10 pb-10">
          {/* Page Header */}
          <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px] mb-6 md:mb-8">
            Kategori Dokumen
          </h1>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Search & Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kategori..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors whitespace-nowrap"
              >
                <Plus size={20} />
                Tambah
              </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4180a9]"></div>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#205d7d] text-white">
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left rounded-tl-lg">Kode</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Nama</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Modul</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Divisi</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Tidak ada data kategori
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{category.code}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{category.name}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">
                            {moduleTypes.find(m => m.value === category.module_type)?.label || category.module_type}
                          </td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{category.division_name || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[25px] w-full max-w-md p-8 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} className="text-gray-500" />
            </button>

            <h2 className="font-['Poppins'] font-semibold text-xl text-[#205d7d] mb-6 text-center">
              {isEditMode ? "Edit Kategori" : "Tambah Kategori"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Kode */}
              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Kode <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  placeholder="Contoh: SM001"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Nama */}
              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Nama <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  placeholder="Contoh: Surat Masuk Umum"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Modul */}
              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Modul <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.module_type}
                  onChange={(e) => setFormData({ ...formData, module_type: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  required
                  disabled={isSubmitting}
                >
                  {moduleTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Divisi */}
              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Divisi
                </label>
                <select
                  value={formData.division_id}
                  onChange={(e) => setFormData({ ...formData, division_id: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Divisi (Opsional)</option>
                  {divisions.map(division => (
                    <option key={division.id} value={division.id}>{division.name}</option>
                  ))}
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukan deskripsi..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : isEditMode ? 'Update' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
