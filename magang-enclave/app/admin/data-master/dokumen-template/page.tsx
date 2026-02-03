"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Search, Plus, Settings, FileText, StickyNote, Clipboard, Upload, Calendar, X } from "lucide-react";
import RichTextEditor from "@/app/components/RichTextEditor";

interface Template {
  id: number;
  name: string;
  description: string;
  type: string;
}

type TabType = 'surat-keluar' | 'memo' | 'notulensi';

interface FormData {
  module: string;
  name: string;
  division: string;
  description: string;
  category: string;
  content: string;
}

export default function DokumenTemplatePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('surat-keluar');
  const [searchQuery, setSearchQuery] = useState("");
  const [allTemplates, setAllTemplates] = useState<Template[]>([
    { id: 1, name: "Surat Peminjaman", description: "Internal", type: "surat-keluar" },
    { id: 2, name: "Surat Permohonan", description: "Eksternal", type: "surat-keluar" },
    { id: 3, name: "Surat Peminjaman Dana", description: "HRD", type: "surat-keluar" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TabType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    module: '',
    name: '',
    division: '',
    description: '',
    category: '',
    content: ''
  });

  const templates = allTemplates.filter(t => t.type === activeTab);

  const fetchTemplates = () => {
    setIsLoading(false);
    // Data sudah ada di state allTemplates
  };

  const handleConfigLevel = (template: Template) => {
    alert(`Config Level untuk: ${template.name}`);
  };

  const handleSubmitModule = () => {
    if (selectedModule) {
      const moduleName = modules.find(m => m.id === selectedModule)?.label || '';
      setFormData({ ...formData, module: moduleName });
      setIsModalOpen(false);
      setIsFormOpen(true);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedModule(null);
    setFormData({
      module: '',
      name: '',
      division: '',
      description: '',
      category: '',
      content: ''
    });
  };

  const handleSubmitForm = () => {
    // Validasi form
    if (!formData.name || !formData.division || !formData.category) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    // Buat template baru dengan ID unik
    const newTemplate: Template = {
      id: Date.now(), // Gunakan timestamp untuk ID unik
      name: formData.name,
      description: formData.division,
      type: selectedModule || activeTab // Gunakan selectedModule yang dipilih
    };

    // Tambahkan ke allTemplates
    setAllTemplates([...allTemplates, newTemplate]);

    console.log('Template berhasil ditambahkan:', {
      ...formData,
      module: selectedModule,
      savedTo: selectedModule
    });

    alert(`Template "${formData.name}" berhasil ditambahkan ke ${formData.module}!`);

    // Reset form dan tutup modal
    handleCloseForm();

    // Pindah ke tab yang sesuai dengan module yang dipilih
    if (selectedModule) {
      setActiveTab(selectedModule);
    }
  };

  const modules = [
    { id: 'surat-keluar' as TabType, label: 'Surat Keluar', icon: FileText },
    { id: 'memo' as TabType, label: 'Memo', icon: StickyNote },
    { id: 'notulensi' as TabType, label: 'Notulensi', icon: Clipboard },
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'surat-keluar' as TabType, label: 'Surat Keluar' },
    { id: 'memo' as TabType, label: 'Memo' },
    { id: 'notulensi' as TabType, label: 'Notulensi' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        <div className="px-6 lg:px-10 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px]">
              Template Dokumen
            </h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
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
                  placeholder="Cari surat, no surat..."
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
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          Tidak ada data template
                        </td>
                      </tr>
                    ) : (
                      filteredTemplates.map((template, index) => (
                        <tr key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{index + 1}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{template.name}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{template.description}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleConfigLevel(template)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#4180a9] text-white rounded-lg text-sm font-['Poppins'] hover:bg-[#356890] transition-colors"
                              >
                                <Settings size={16} /> Config Level
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

      {/* Form Tambah Template */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="bg-white border-b border-gray-200 px-8 py-6 rounded-t-[20px] flex justify-between items-center flex-shrink-0">
              <h2 className="font-['Poppins'] font-semibold text-2xl text-gray-900">
                Tambah Template
              </h2>
              <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {/* Module & Nama Dokumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                    Module<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.module}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins'] text-sm"
                  />
                </div>
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
                  />
                </div>
              </div>

              {/* Divisi */}
              <div>
                <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                  Divisi<span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                >
                  <option value="">Pilih Divisi</option>
                  <option value="internal">Internal</option>
                  <option value="eksternal">Eksternal</option>
                  <option value="hrd">HRD</option>
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
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block font-['Poppins'] font-medium text-gray-700 mb-2">
                  Kategori<span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                >
                  <option value="">Pilih kategori...</option>
                  <option value="umum">Umum</option>
                  <option value="penting">Penting</option>
                  <option value="rahasia">Rahasia</option>
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
            </div>

            {/* Buttons - Fixed at bottom */}
            <div className="border-t border-gray-200 px-8 py-6 bg-white rounded-b-[20px] flex gap-4 flex-shrink-0">
              <button
                onClick={handleCloseForm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-['Poppins'] font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForm}
                className="flex-1 px-6 py-3 bg-[#4180a9] text-white rounded-lg font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors"
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
