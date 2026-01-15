"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X } from "lucide-react";

interface Department {
  id: number;
  name: string;
  code: string;
  division_id: number;
  division_name: string;
  is_active: boolean;
}

interface Division {
  id: number;
  name: string;
}

export default function DepartemenPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", division_id: "" });

  useEffect(() => {
    fetchDepartments();
    fetchDivisions();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/departments');
      if (!response.ok) throw new Error('Gagal mengambil data departemen');
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/admin/divisions');
      if (!response.ok) throw new Error('Gagal mengambil data divisi');
      const data = await response.json();
      setDivisions(data.divisions || []);
    } catch (err) {
      console.error('Error fetching divisions for dropdown:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.division_id) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const url = isEditMode ? `/api/admin/departments/${editId}` : '/api/admin/departments';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan departemen');

      alert(isEditMode ? 'Departemen berhasil diperbarui!' : 'Departemen berhasil ditambahkan!');
      await fetchDepartments(); 
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (department: Department) => {
    setFormData({ 
      name: department.name, 
      code: department.code, 
      division_id: department.division_id.toString()
    });
    setEditId(department.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus departemen ini?")) return;

    try {
      const response = await fetch(`/api/admin/departments/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus departemen');

      alert('Departemen berhasil dihapus!');
      await fetchDepartments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus departemen');
    }
  };

  const handleToggleStatus = async (department: Department) => {
    try {
      const response = await fetch(`/api/admin/departments/${department.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...department, is_active: !department.is_active }),
      });
      if (!response.ok) throw new Error('Gagal mengubah status');
      await fetchDepartments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({ name: "", code: "", division_id: "" });
    setError("");
  };

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.division_name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px] mb-6 md:mb-8">Departemen</h1>

          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Search & Tambah Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Departemen ..." className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]" />
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
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Nama Departemen</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Kode Departemen</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Divisi</th> {/* KOLOM BARU */}
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">Status</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((department) => (
                      <tr key={department.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{department.name}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{department.code}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{department.division_name}</td> {/* DATA BARU */}
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleToggleStatus(department)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${department.is_active ? "bg-green-500" : "bg-red-500"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${department.is_active ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(department)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                            <button onClick={() => handleDelete(department.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
          <div className="bg-white rounded-[25px] w-full max-w-md p-6 md:p-8 shadow-2xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"><X size={24} className="text-gray-500" /></button>
            <h2 className="font-['Poppins'] font-semibold text-2xl mb-6">{isEditMode ? "Edit Departemen" : "Tambah Departemen"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Nama Departemen <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Kode Departemen <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} />
                </div>
                {/* DROPDOWN DIVISI */}
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Divisi <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.division_id} 
                    onChange={(e) => setFormData({ ...formData, division_id: e.target.value })} 
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] bg-white" 
                    required 
                    disabled={isSubmitting}
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
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