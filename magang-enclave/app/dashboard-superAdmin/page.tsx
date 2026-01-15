"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, X, Menu } from "lucide-react";
import SidebarSuperAdmin from "../components/sidebar-superadmin";
import { useAuth } from '@/lib/auth-context';

interface Account {
  id: number;
  name: string;
  email: string;
  company_name: string;
  tanggalDibuat: string;
  status: boolean;
}

export default function DashboardSuperAdmin() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/accounts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.company_name ||
      (!editingId && (!formData.password || !formData.confirmPassword))
    ) {
      setError("Semua field harus diisi!");
      return;
    }

    if (!editingId && formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      let url = '/api/admin/accounts';
      let method = 'POST';
      
      if (editingId !== null) {
        url = `/api/admin/accounts/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company_name: formData.company_name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save account');
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        company_name: "",
      });
      setEditingId(null);
      setShowModal(false);
      
      await fetchAccounts();
      alert(editingId ? 'Account updated successfully!' : 'Account created successfully!');
    } catch (error) {
      console.error('Error saving account:', error);
      setError(error instanceof Error ? error.message : 'Failed to save account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      email: account.email,
      password: "",
      confirmPassword: "",
      company_name: account.company_name,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;
    try {
      const response = await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete account');
      await fetchAccounts();
      alert('Account deleted successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete account');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/accounts/${id}/toggle-status`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to toggle account status');
      await fetchAccounts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to toggle account status');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      company_name: "",
    });
    setError("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarSuperAdmin isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200">
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="px-6 lg:px-10 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="font-['Poppins'] font-bold text-3xl text-gray-900 mb-6">Akun Terdaftar</h1>
              <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Cari Akun..." className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent" />
                </div>
                <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-white border-2 border-gray-900 rounded-lg font-['Poppins'] font-medium text-gray-900 hover:bg-gray-50 transition-colors">Buat Akun</button>
              </div>
            </div>

            {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#277ba7]"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#1a5f7a] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">No</th>
                      <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">Nama</th>
                      <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">Email</th>
                      <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">Nama Perusahaan</th>
                      <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">Tanggal Dibuat</th>
                      <th className="px-6 py-4 text-center font-['Poppins'] font-semibold text-sm">Status</th>
                      <th className="px-6 py-4 text-center font-['Poppins'] font-semibold text-sm">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Tidak ada akun yang terdaftar</td></tr>
                    ) : (
                      accounts.map((account, index) => (
                        <tr key={account.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">{account.name}</td>
                          <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">{account.email}</td>
                          <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">{account.company_name}</td>
                          <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">{account.tanggalDibuat}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button onClick={() => handleToggleStatus(account.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${account.status ? "bg-green-500" : "bg-red-500"}`} title={account.status ? "Aktif" : "Tidak Aktif"}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${account.status ? "translate-x-6" : "translate-x-1"}`} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button onClick={() => handleEdit(account)} className="p-2 text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Edit"><Edit2 className="w-5 h-5" /></button>
                              <button onClick={() => handleDelete(account.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus"><Trash2 className="w-5 h-5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
              <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
              <h2 className="font-['Poppins'] font-semibold text-2xl text-[#1a5f7a] mb-6 text-center">{editingId ? "Edit Akun" : "Buat Akun Baru"}</h2>
              {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
              <div className="space-y-4">
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} placeholder="Nama perusahaan" className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent" disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">Nama Admin</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama lengkap admin" className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent" disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email admin" className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent" disabled={isSubmitting} />
                </div>
                {!editingId && (
                  <>
                    <div>
                      <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Konfirmasi password" className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent" disabled={isSubmitting} />
                    </div>
                  </>
                )}
                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-6 px-6 py-3 bg-[#1a5f7a] text-white rounded-lg font-['Poppins'] font-medium hover:bg-[#144a5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Menyimpan...' : (editingId ? "Simpan Perubahan" : "Buat Akun")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}