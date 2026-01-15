"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X } from "lucide-react";

interface User {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  division_id: number;
  department_id: number;
  position_id: number;
  role: string;
  is_active: boolean;
  division_name: string;
  department_name: string;
  position_name: string;
}

interface Division { id: number; name: string; }
interface Department { id: number; name: string; }
interface Position { id: number; name: string; }

const roleOptions = ['approver', 'secretary', 'general'];

export default function PegawaiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    employee_id: string;
    full_name: string;
    email: string;
    password_hash?: string;
    division_id: string;
    department_id: string;
    position_id: string;
    role: string;
  }>({
    employee_id: "",
    full_name: "",
    email: "",
    password_hash: "",
    division_id: "",
    department_id: "",
    position_id: "",
    role: "",
  });

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, divisionsRes, departmentsRes, positionsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/divisions'),
        fetch('/api/admin/departments'),
        fetch('/api/admin/positions'),
      ]);

      if (!usersRes.ok) throw new Error('Gagal mengambil data pegawai');
      if (!divisionsRes.ok) throw new Error('Gagal mengambil data divisi');
      if (!departmentsRes.ok) throw new Error('Gagal mengambil data departemen');
      if (!positionsRes.ok) throw new Error('Gagal mengambil data jabatan');

      const [usersData, divisionsData, departmentsData, positionsData] = await Promise.all([
        usersRes.json(),
        divisionsRes.json(),
        departmentsRes.json(),
        positionsRes.json(),
      ]);

      setUsers(usersData.users || []);
      setDivisions(divisionsData.divisions || []);
      setDepartments(departmentsData.departments || []);
      setPositions(positionsData.positions || []);
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
    const requiredFields = ['employee_id', 'full_name', 'email', 'division_id', 'department_id', 'position_id', 'role'];
    const isCreateMode = !isEditMode;
    
    if (requiredFields.some(field => !formData[field as keyof typeof formData])) {
      setError(isCreateMode ? "Semua field wajib diisi." : "Field password boleh kosong.");
      return;
    }
    if (isCreateMode && !formData.password_hash) {
      setError("Password wajib diisi untuk pegawai baru.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const url = isEditMode ? `/api/admin/users/${editId}` : '/api/admin/users';
    const method = isEditMode ? 'PUT' : 'POST';
    
    const body = { ...formData };
    if (isEditMode && !body.password_hash) {
      delete body.password_hash;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan pegawai');

      alert(isEditMode ? 'Pegawai berhasil diperbarui!' : 'Pegawai berhasil ditambahkan!');
      await fetchAllData();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      employee_id: user.employee_id,
      full_name: user.full_name,
      email: user.email,
      password_hash: "",
      division_id: user.division_id.toString(),
      department_id: user.department_id.toString(),
      position_id: user.position_id.toString(),
      role: user.role,
    });
    setEditId(user.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus pegawai');

      alert('Pegawai berhasil dihapus!');
      await fetchAllData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus pegawai');
    }
  };
  
  const handleToggleStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, is_active: !user.is_active }),
      });
      if (!response.ok) throw new Error('Gagal mengubah status');
      await fetchAllData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({ employee_id: "", full_name: "", email: "", password_hash: "", division_id: "", department_id: "", position_id: "", role: "" });
    setError("");
  };

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200">
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>
        <div className="px-6 lg:px-10 pb-10">
          <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px] mb-6 md:mb-8">Pegawai</h1>
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Pegawai ..." className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]" />
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors whitespace-nowrap">
                <Plus size={20} /> Tambah
              </button>
            </div>
            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
            {isLoading ? (
              <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4180a9]"></div></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#205d7d] text-white">
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">ID Pegawai</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Nama Lengkap</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Email</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Divisi</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Departemen</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Jabatan</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">Status</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{user.employee_id}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{user.full_name}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{user.email}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{user.division_name}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{user.department_name}</td>
                        <td className="px-4 py-3 font-['Poppins'] text-sm">{user.position_name}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleToggleStatus(user)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.is_active ? "bg-green-500" : "bg-red-500"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.is_active ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                            <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
          <div className="bg-white rounded-[25px] w-full max-w-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"><X size={24} className="text-gray-500" /></button>
            <h2 className="font-['Poppins'] font-semibold text-2xl mb-6">{isEditMode ? "Edit Pegawai" : "Tambah Pegawai"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">ID Pegawai <span className="text-red-500">*</span></label><input type="text" value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} /></div>
                <div><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Nama Lengkap <span className="text-red-500">*</span></label><input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} /></div>
                <div className="md:col-span-2"><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Email <span className="text-red-500">*</span></label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required disabled={isSubmitting} /></div>
                <div><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Divisi <span className="text-red-500">*</span></label><select value={formData.division_id} onChange={(e) => setFormData({ ...formData, division_id: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] bg-white" required disabled={isSubmitting}><option value="">Pilih Divisi</option>{divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                <div><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Departemen <span className="text-red-500">*</span></label><select value={formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] bg-white" required disabled={isSubmitting}><option value="">Pilih Departemen</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                <div><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Jabatan <span className="text-red-500">*</span></label><select value={formData.position_id} onChange={(e) => setFormData({ ...formData, position_id: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] bg-white" required disabled={isSubmitting}><option value="">Pilih Jabatan</option>{positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div><label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Role <span className="text-red-500">*</span></label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] bg-white" required disabled={isSubmitting}><option value="">Pilih Role</option>{roleOptions.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                <div className="md:col-span-2">
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">Password {isEditMode && <span className="font-normal text-gray-500">(Kosongkan jika tidak ingin diubah)</span>} {!isEditMode && <span className="text-red-500">*</span>}</label>
                  <input type="password" value={formData.password_hash} onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })} className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9]" required={!isEditMode} disabled={isSubmitting} />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50" disabled={isSubmitting}>Batal</button>
                <button type="submit" className="flex-1 px-6 py-2.5 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : (isEditMode ? "Simpan Perubahan" : "Tambah Pegawai")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}