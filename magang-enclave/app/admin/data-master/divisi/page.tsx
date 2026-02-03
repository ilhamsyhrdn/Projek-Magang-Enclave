"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X } from "lucide-react";

// Sesuaikan dengan struktur data dari API
interface Division {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

export default function DivisiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "" });

  // Fetch data saat komponen dimuat
  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/divisions');
      if (!response.ok) throw new Error('Gagal mengambil data divisi');
      const data = await response.json();
      setDivisions(data.divisions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      setError("Nama dan kode divisi wajib diisi.");
      return;
    }

    await saveDivision();
  };

  const saveDivision = async () => {
    setIsSubmitting(true);
    setError("");

    const url = isEditMode ? `/api/admin/divisions/${editId}` : '/api/admin/divisions';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan divisi');

      alert(isEditMode ? 'Divisi berhasil diperbarui!' : 'Divisi berhasil ditambahkan!');
      await fetchDivisions();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (division: Division) => {
    setFormData({ name: division.name, code: division.code });
    setEditId(division.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/divisions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus divisi');

      if (data.soft_deleted) {
        alert('Divisi tidak dapat dihapus karena masih digunakan, status diubah menjadi non-aktif.');
      } else {
        alert('Divisi berhasil dihapus!');
      }
      await fetchDivisions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus divisi');
    }
  };

  const handleToggleStatus = async (division: Division) => {
    try {
      const response = await fetch(`/api/admin/divisions/${division.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...division, is_active: !division.is_active }),
      });
      if (!response.ok) throw new Error('Gagal mengubah status');

      // Update state lokal tanpa fetch ulang untuk mempertahankan urutan
      setDivisions(prevDivisions =>
        prevDivisions.map(div =>
          div.id === division.id
            ? { ...div, is_active: !div.is_active }
            : div
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({ name: "", code: "" });
    setError("");
    setIsSubmitting(false);
  };

  // Filter data berdasarkan pencarian
  const filteredDivisions = divisions.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px] mb-6 md:mb-8">Divisi</h1>

          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Search & Tambah Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Divisi ..." className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]" />
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
                    <tr className="bg-[#205d7d] text-white">
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left rounded-tl-lg">Nama Divisi</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">Action</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDivisions.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">Tidak ada data divisi</td></tr>
                    ) : (
                      filteredDivisions.map((division) => (
                        <tr key={division.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{division.name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleEdit(division)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                                <Pencil size={18} />
                              </button>
                              <button onClick={() => handleDelete(division.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <button onClick={() => handleToggleStatus(division)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${division.is_active ? "bg-green-500" : "bg-gray-300"}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${division.is_active ? "translate-x-6" : "translate-x-1"}`} />
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
          <div className="bg-white rounded-[25px] w-full max-w-md p-6 md:p-8 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"><X size={24} className="text-gray-500" /></button>
            <h2 className="font-['Poppins'] font-semibold text-2xl mb-6">{isEditMode ? "Edit Divisi" : "Tambah Divisi"}</h2>
            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Nama Divisi <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Kode Divisi <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50" disabled={isSubmitting}>Batal</button>
                <button type="submit" className="flex-1 h-12 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
