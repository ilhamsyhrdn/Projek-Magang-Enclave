"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X } from "lucide-react";

interface Position {
  id: number;
  name: string;
  level: string;
  description: string;
  is_active: boolean;
}

export default function JabatanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", level: "", description: "" });

  const levelOptions = [
    "Struktural - Tingkat 1",
    "Struktural - Tingkat 2",
    "Struktural - Tingkat 3",
    "Non-Struktural"
  ];

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/positions');
      if (!response.ok) throw new Error('Gagal mengambil data jabatan');
      const data = await response.json();
      setPositions(data.positions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.level) {
      setError("Nama dan tingkat jabatan wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const url = isEditMode ? `/api/admin/positions/${editId}` : '/api/admin/positions';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan jabatan');

      alert(isEditMode ? 'Jabatan berhasil diperbarui!' : 'Jabatan berhasil ditambahkan!');
      await fetchPositions();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (position: Position) => {
    setFormData({ 
      name: position.name, 
      level: position.level, 
      description: position.description
    });
    setEditId(position.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jabatan ini?")) return;

    try {
      const response = await fetch(`/api/admin/positions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus jabatan');

      alert('Jabatan berhasil dihapus!');
      await fetchPositions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus jabatan');
    }
  };

  const handleToggleStatus = async (position: Position) => {
    try {
      const response = await fetch(`/api/admin/positions/${position.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...position, is_active: !position.is_active }),
      });
      if (!response.ok) throw new Error('Gagal mengubah status');
      await fetchPositions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({ name: "", level: "", description: "" });
    setError("");
  };

  const filteredPositions = positions.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200">
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 lg:px-10 pb-10">
          <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px] mb-6 md:mb-8">Jabatan/Posisi</h1>

          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Search & Tambah Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Jabatan ..." className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]" />
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors whitespace-nowrap">
                <Plus size={20} /> Tambah
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

            {/* Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4180a9]"></div></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">No</th>
                      <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Nama Jabatan</th>
                      <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Tingkat Jabatan</th>
                      <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Deskripsi</th>
                      <th className="px-4 py-3 text-center font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Status</th>
                      <th className="px-4 py-3 text-center font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPositions.map((position, index) => (
                      <tr key={position.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{index + 1}</td>
                        <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{position.name}</td>
                        <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{position.level}</td>
                        <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{position.description}</td>
                        <td className="px-4 py-4 text-center">
                          <button onClick={() => handleToggleStatus(position)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${position.is_active ? "bg-green-500" : "bg-red-500"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${position.is_active ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(position)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                            <button onClick={() => handleDelete(position.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
          <div className="bg-white rounded-[25px] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"><X size={24} className="text-gray-500" /></button>
            <h2 className="font-['Poppins'] font-semibold text-2xl mb-6">{isEditMode ? "Edit Jabatan" : "Tambah Jabatan"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Nama Jabatan <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Tingkat Jabatan <span className="text-red-500">*</span></label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] bg-white" required disabled={isSubmitting}>
                    <option value="">Pilih Tingkat Jabatan</option>
                    {levelOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Deskripsi</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" rows={4} disabled={isSubmitting}></textarea>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50" disabled={isSubmitting}>Batal</button>
                <button type="submit" className="flex-1 h-12 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Update' : 'Simpan')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}