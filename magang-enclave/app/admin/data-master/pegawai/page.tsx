"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X, Eye, EyeOff } from "lucide-react";

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
interface Department { id: number; name: string; division_id: number; }
interface Position { id: number; name: string; }

const roleOptions = ['director', 'approver', 'secretary', 'general'];

export default function PegawaiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    confirmPassword: "",
  });
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

  // State untuk custom dropdown
  const [isDivisionOpen, setIsDivisionOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  // Filter departemen berdasarkan divisi yang dipilih
  const filteredDepartments = formData.division_id
    ? departments.filter(d => d.division_id.toString() === formData.division_id)
    : [];

  // Generate random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

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

    // Field wajib: employee_id, full_name, email, position_id, role
    const requiredFields = ['employee_id', 'full_name', 'email', 'position_id', 'role'];

    if (requiredFields.some(field => !formData[field as keyof typeof formData])) {
      setError("Field wajib diisi: ID Pegawai, Nama Lengkap, Email, Jabatan, dan Role");
      return;
    }

    await saveUser();
  };

  const saveUser = async () => {
    setIsSubmitting(true);
    setError("");

    // Gunakan employee_id dari input user
    const employeeId = formData.employee_id;
    const role = formData.role || 'general';
    const password = isEditMode ? formData.password_hash : generateRandomPassword();

    const url = isEditMode ? `/api/admin/users/${editId}` : '/api/admin/users';
    const method = isEditMode ? 'PUT' : 'POST';

    // Kirim NULL jika divisi atau departemen kosong
    const body = {
      ...formData,
      employee_id: employeeId,
      role: role,
      password_hash: password,
      division_id: formData.division_id ? parseInt(formData.division_id) : null,
      department_id: formData.department_id ? parseInt(formData.department_id) : null,
      position_id: formData.position_id ? parseInt(formData.position_id) : null,
    };

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
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
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
      division_id: user.division_id?.toString() || "",
      department_id: user.department_id?.toString() || "",
      position_id: user.position_id?.toString() || "",
      role: user.role,
    });
    setEditId(user.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setEditId(id);
    setIsConfirmModalOpen(true);
  };

  const performDelete = async () => {
    if (!editId) return;

    setIsSubmitting(true);
    setConfirmError("");

    if (!confirmPassword.password || !confirmPassword.confirmPassword) {
      setConfirmError("Kedua field password harus diisi!");
      setIsSubmitting(false);
      return;
    }

    if (confirmPassword.password !== confirmPassword.confirmPassword) {
      setConfirmError("Password dan Konfirmasi Password tidak sama!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${editId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus pegawai');

      alert('Pegawai berhasil dihapus!');
      await fetchAllData();
      handleCloseConfirmModal();
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Gagal menghapus pegawai');
    } finally {
      setIsSubmitting(false);
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
    setIsSubmitting(false);
    setIsDivisionOpen(false);
    setIsDepartmentOpen(false);
    setIsPositionOpen(false);
    setIsRoleOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmPassword({
      password: "",
      confirmPassword: "",
    });
    setConfirmError("");
    setEditId(null);
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
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left rounded-tl-lg">ID Pegawai</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Nama Lengkap</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Email</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Divisi</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-left">Departmen</th>
                      <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Tidak ada data pegawai</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{user.employee_id}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{user.full_name}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{user.email}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{user.division_name || '-'}</td>
                          <td className="px-4 py-3 font-['Poppins'] text-sm">{user.department_name || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleEdit(user)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                                <Pencil size={18} />
                              </button>
                              <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
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
            <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} className="text-gray-500" />
            </button>
            <h2 className="font-['Poppins'] font-semibold text-xl text-[#205d7d] mb-6 text-center">{isEditMode ? "Edit Pegawai" : "Tambah Pegawai"}</h2>
            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* ID Pegawai - Wajib diisi */}
                <div>
                  <input
                    type="text"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    placeholder="ID Pegawai *"
                    className="w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Nama Lengkap - Wajib */}
                <div>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Nama lengkap pegawai *"
                    className="w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Email - Wajib */}
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email *"
                    className="w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Custom Dropdown Divisi*/}
                <div className="relative">
                  <div
                    onClick={() => !isSubmitting && setIsDivisionOpen(!isDivisionOpen)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm text-gray-500 focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] bg-white cursor-pointer flex items-center justify-between hover:border-[#4180a9] transition-colors"
                  >
                    <span className={formData.division_id ? "text-gray-900" : "text-gray-500"}>
                      {formData.division_id ? divisions.find(d => d.id.toString() === formData.division_id)?.name : "Divisi"}
                    </span>
                    <svg className={`fill-current h-4 w-4 text-gray-400 transition-transform ${isDivisionOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                  {isDivisionOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsDivisionOpen(false)}></div>
                      <div className="division-dropdown absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] max-h-48 overflow-y-auto">
                        <div
                          onClick={() => {
                            setFormData({ ...formData, division_id: "", department_id: "" });
                            setIsDivisionOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-[#f0f7ff] cursor-pointer font-['Poppins'] text-sm text-gray-700 transition-colors rounded-t-[15px]"
                        >
                          -
                        </div>
                        {divisions.map((d, index) => (
                          <div
                            key={d.id}
                            onClick={() => {
                              setFormData({ ...formData, division_id: d.id.toString(), department_id: "" });
                              setIsDivisionOpen(false);
                            }}
                            className={`px-4 py-3 hover:bg-[#f0f7ff] cursor-pointer font-['Poppins'] text-sm text-gray-700 transition-colors ${
                              index === divisions.length - 1 ? 'rounded-b-[15px] border-b-0' : 'border-b border-gray-100'
                            }`}
                          >
                            {d.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Custom Dropdown Departemen*/}
                <div className="relative">
                  <div
                    onClick={() => !isSubmitting && formData.division_id && setIsDepartmentOpen(!isDepartmentOpen)}
                    className={`w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm text-gray-500 focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] bg-white flex items-center justify-between transition-colors ${
                      formData.division_id ? 'cursor-pointer hover:border-[#4180a9]' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className={formData.department_id ? "text-gray-900" : "text-gray-500"}>
                      {formData.division_id 
                        ? (formData.department_id ? filteredDepartments.find(d => d.id.toString() === formData.department_id)?.name : "Departemen")
                        : "Departemen"
                      }
                    </span>
                    <svg className={`fill-current h-4 w-4 text-gray-400 transition-transform ${isDepartmentOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                  {isDepartmentOpen && formData.division_id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsDepartmentOpen(false)}></div>
                      <div className="department-dropdown absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] max-h-48 overflow-y-auto">
                        <div
                          onClick={() => {
                            setFormData({ ...formData, department_id: "" });
                            setIsDepartmentOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-[#f0f7ff] cursor-pointer font-['Poppins'] text-sm text-gray-700 transition-colors rounded-t-[15px]"
                        >
                          -
                        </div>
                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map((d, index) => (
                            <div
                              key={d.id}
                              onClick={() => {
                                setFormData({ ...formData, department_id: d.id.toString() });
                                setIsDepartmentOpen(false);
                              }}
                              className={`px-4 py-3 hover:bg-[#f0f7ff] cursor-pointer font-['Poppins'] text-sm text-gray-700 transition-colors ${
                                index === filteredDepartments.length - 1 ? 'rounded-b-[15px]' : 'border-b border-gray-100'
                              }`}
                            >
                              {d.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-gray-500 font-['Poppins'] text-sm">
                            Tidak ada departemen untuk divisi ini
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {/* Custom Dropdown Jabatan - Wajib */}
                <div className="relative">
                  <div
                    onClick={() => !isSubmitting && setIsPositionOpen(!isPositionOpen)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm text-gray-500 focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] bg-white cursor-pointer flex items-center justify-between hover:border-[#4180a9] transition-colors"
                  >
                    <span className={formData.position_id ? "text-gray-900" : "text-gray-500"}>
                      {formData.position_id ? positions.find(p => p.id.toString() === formData.position_id)?.name : "Jabatan *"}
                    </span>
                    <svg className={`fill-current h-4 w-4 text-gray-400 transition-transform ${isPositionOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                  {isPositionOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsPositionOpen(false)}></div>
                      <div className="position-dropdown absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] max-h-48 overflow-y-auto">
                        {positions.map((p, index) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setFormData({ ...formData, position_id: p.id.toString() });
                              setIsPositionOpen(false);
                            }}
                            className={`px-4 py-3 hover:bg-[#f0f7ff] cursor-pointer font-['Poppins'] text-sm text-gray-700 transition-colors ${
                              index === 0 ? 'rounded-t-[15px]' : ''
                            } ${
                              index === positions.length - 1 ? 'rounded-b-[15px]' : 'border-b border-gray-100'
                            }`}
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Custom Dropdown Role - Wajib */}
                <div className="relative">
                  <div
                    onClick={() => !isSubmitting && setIsRoleOpen(!isRoleOpen)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-full font-['Poppins'] text-sm text-gray-500 focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9] bg-white cursor-pointer flex items-center justify-between hover:border-[#4180a9] transition-colors"
                  >
                    <span className={formData.role ? "text-gray-900" : "text-gray-500"}>
                      {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : "Role *"}
                    </span>
                    <svg className={`fill-current h-4 w-4 text-gray-400 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                  {isRoleOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsRoleOpen(false)}></div>
                      <div className="role-dropdown absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] max-h-48 overflow-y-auto">
                        {roleOptions.map((role, index) => (
                          <div
                            key={role}
                            onClick={() => {
                              setFormData({ ...formData, role: role });
                              setIsRoleOpen(false);
                            }}
                            className={`px-4 py-3 hover:bg-[#f0f7ff] cursor-pointer font-['Poppins'] text-sm text-gray-700 transition-colors ${
                              index === 0 ? 'rounded-t-[15px]' : ''
                            } ${
                              index === roleOptions.length - 1 ? 'rounded-b-[15px]' : 'border-b border-gray-100'
                            }`}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#4180a9] text-white rounded-full font-['Poppins'] font-medium text-sm hover:bg-[#356890] disabled:opacity-50 mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Password untuk Delete */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={handleCloseConfirmModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg" disabled={isSubmitting}>
              <X size={24} className="text-gray-500" />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-orange-500 text-3xl font-bold">!</span>
              </div>
              <h2 className="font-['Poppins'] font-bold text-2xl text-gray-900 text-center">
                Konfirmasi Persetujuan
              </h2>
            </div>

            <p className="font-['Poppins'] text-sm text-gray-600 text-center mb-6">
              Demi keamanan, setiap aksi penghapusan memerlukan verifikasi akun.
              Masukkan password sebelum melanjutkan proses
            </p>

            {confirmError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {confirmError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword.password}
                    onChange={(e) => setConfirmPassword({ ...confirmPassword, password: e.target.value })}
                    placeholder="Masukan Password..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#4180a9] focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-['Poppins'] text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword.confirmPassword}
                    onChange={(e) => setConfirmPassword({ ...confirmPassword, confirmPassword: e.target.value })}
                    placeholder="Konfirmasi password anda..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#4180a9] focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseConfirmModal}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-full font-['Poppins'] font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={performDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-full font-['Poppins'] font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Memproses...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}