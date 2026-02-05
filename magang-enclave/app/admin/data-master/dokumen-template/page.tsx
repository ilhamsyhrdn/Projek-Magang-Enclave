"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Search, Plus, Settings, FileText, StickyNote, Clipboard, X, Edit2, Trash2 } from "lucide-react";
import RichTextEditor from "@/app/components/RichTextEditor";

interface Template {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string | null;
  division_id: number | null;
  content: string | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

interface Division {
  id: number;
  name: string;
  description: string | null;
}

type TabType = 'surat-keluar' | 'memo' | 'notulensi';

interface FormData {
  name: string;
  description: string;
  category_id: string;
  division_id: string;
  content: string;
}

export default function DokumenTemplatePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('surat-keluar');
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TabType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category_id: '',
    division_id: '',
    content: ''
  });

  const modules = [
    { id: 'surat-keluar' as TabType, label: 'Surat Keluar', icon: FileText },
    { id: 'memo' as TabType, label: 'Memo', icon: StickyNote },
    { id: 'notulensi' as TabType, label: 'Notulensi', icon: Clipboard },
  ];

  const tabs = [
    { id: 'surat-keluar' as TabType, label: 'Surat Keluar' },
    { id: 'memo' as TabType, label: 'Memo' },
    { id: 'notulensi' as TabType, label: 'Notulensi' },
  ];

  // Fetch templates filtered by active tab
  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/admin/templates?module_type=${activeTab}&search=${searchQuery}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Gagal mengambil data template');

      setTemplates(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();

      if (!response.ok) throw new Error('Gagal mengambil data kategori');

      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data kategori');
    }
  };

  // Fetch divisions
  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/admin/divisions');
      const data = await response.json();

      if (!response.ok) throw new Error('Gagal mengambil data divisi');

      setDivisions(data.divisions || []);
    } catch (err) {
      console.error('Error fetching divisions:', err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchTemplates(), fetchCategories(), fetchDivisions()])
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  useEffect(() => {
    fetchTemplates();
  }, [searchQuery]);

  const handleConfigLevel = (template: Template) => {
    alert(`Config Level untuk: ${template.name}`);
  };

  const handleSubmitModule = () => {
    if (selectedModule) {
      const moduleName = modules.find(m => m.id === selectedModule)?.label || '';
      setIsFormOpen(true);
      setIsModalOpen(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedModule(null);
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      division_id: '',
      content: ''
    });
    setError("");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.description || !formData.category_id) {
      setError('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEditMode
        ? `/api/admin/templates/${editId}?module_type=${selectedModule || activeTab}`
        : '/api/admin/templates';
      const method = isEditMode ? 'PUT' : 'POST';

      const body = {
        name: formData.name,
        description: formData.description,
        module_type: selectedModule || activeTab,
        category_id: parseInt(formData.category_id),
        division_id: formData.division_id ? parseInt(formData.division_id) : null,
        content: formData.content || null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menyimpan template');

      setSuccess(isEditMode ? 'Template berhasil diperbarui!' : 'Template berhasil ditambahkan!');

      await fetchTemplates();
      handleCloseForm();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      description: template.description,
      category_id: template.category_id.toString(),
      division_id: template.division_id?.toString() || '',
      content: template.content || '',
    });
    setEditId(template.id);
    setIsEditMode(true);
    setSelectedModule(activeTab);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        const response = await fetch(`/api/admin/templates/${id}?module_type=${activeTab}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Gagal menghapus template');

        setSuccess('Template berhasil dihapus!');
        await fetchTemplates();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus template';
        setError(errorMessage);
      }
    }
  };

  // Filter templates by search query
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.category_name && template.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDivisionName = (divisionId: number | null) => {
    if (!divisionId) return '-';
    const division = divisions.find(d => d.id === divisionId);
    return division ? division.name : '-';
  };

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
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px]">
              Template Dokumen
            </h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
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

            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 font-['Poppins'] font-medium text-sm md:text-base transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#4180a9]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Search & Tambah Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari template..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors whitespace-nowrap"
              >
                <Plus size={20} /> Tambah
              </button>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4180a9]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#205d7d] text-white">
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left rounded-tl-lg">No</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Nama Dokumen</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Deskripsi</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Kategori</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Divisi</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Tidak ada data template
                        </td>
                      </tr>
                    ) : (
                      filteredTemplates.map((template, index) => (
                        <tr key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{index + 1}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{template.name}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{template.description}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{template.category_name || '-'}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{getDivisionName(template.division_id)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(template)}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleConfigLevel(template)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Config Level"
                              >
                                <Settings size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(template.id)}
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

      {/* Modal Pilih Module */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-2xl p-8">
            <h2 className="font-['Poppins'] font-semibold text-2xl text-gray-900 mb-2">
              Pilih Module
            </h2>
            <p className="font-['Poppins'] text-gray-600 mb-8">
              Pilih Module untuk menambahkan template
            </p>

            <div className="space-y-4 mb-8">
              {modules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-[15px] transition-all ${
                      selectedModule === module.id
                        ? 'border-[#4180a9] bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      selectedModule === module.id ? 'bg-[#4180a9] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <IconComponent size={24} />
                    </div>
                    <span className="font-['Poppins'] text-lg font-medium text-gray-900">
                      {module.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedModule(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-full font-['Poppins'] font-medium text-sm hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitModule}
                disabled={!selectedModule}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full font-['Poppins'] font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Tambah/Edit Template */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="bg-white border-b border-gray-200 px-8 py-6 rounded-t-[20px] flex justify-between items-center flex-shrink-0">
              <h2 className="font-['Poppins'] font-semibold text-2xl text-gray-900">
                {isEditMode ? 'Edit Template' : 'Tambah Template'}
              </h2>
              <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Module (Read-only) */}
                <div>
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Module<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedModule ? modules.find(m => m.id === selectedModule)?.label : ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins'] text-sm"
                  />
                </div>

                {/* Nama Dokumen */}
                <div>
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Nama Dokumen<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukan nama dokumen..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Divisi */}
                <div>
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Divisi
                  </label>
                  <select
                    value={formData.division_id}
                    onChange={(e) => setFormData({ ...formData, division_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
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
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Deskripsi<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Masukan Deskripsi...."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Kategori<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Pilih kategori...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Isi Surat */}
                <div>
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Isi Surat
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Mulai menulis isi surat..."
                  />
                </div>
              </form>
            </div>

            {/* Buttons - Fixed at bottom */}
            <div className="border-t border-gray-200 px-8 py-6 bg-white rounded-b-[20px] flex gap-4 flex-shrink-0">
              <button
                onClick={handleCloseForm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-['Poppins'] font-medium text-sm hover:bg-red-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForm}
                className="flex-1 px-6 py-3 bg-[#4180a9] text-white rounded-lg font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : isEditMode ? 'Update' : 'Buat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
