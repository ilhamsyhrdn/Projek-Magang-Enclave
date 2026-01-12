"use client";

import { useState } from "react";
import { Search, Edit2, Trash2, X, Menu } from "lucide-react";
import SidebarSuperAdmin from "../components/sidebar-superAdmin";

interface Account {
  id: number;
  email: string;
  tanggalDibuat: string;
  namaPerusahaan: string;
  status: boolean;
}

export default function DashboardSuperAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 1,
      email: "Rayhannugrah@gmail.com",
      tanggalDibuat: "12 Desember 2025",
      namaPerusahaan: "PT. Angin Ribut",
      status: true,
    },
    {
      id: 2,
      email: "ilhamsyah@gmail.com",
      tanggalDibuat: "30 Maret 2025",
      namaPerusahaan: "PT. Angin Ribut",
      status: true,
    },
    {
      id: 3,
      email: "Chandra@gmail.com",
      tanggalDibuat: "13 Februari 2025",
      namaPerusahaan: "PT. Angin Ribut",
      status: false,
    },
    {
      id: 4,
      email: "approver@user.com",
      tanggalDibuat: "12 Januari 2026",
      namaPerusahaan: "PT. Angin Ribut",
      status: true,
    },
  ]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    namaPerusahaan: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.namaPerusahaan
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    if (editingId !== null) {
      // Edit existing account
      setAccounts(
        accounts.map((acc) =>
          acc.id === editingId
            ? {
                ...acc,
                email: formData.email,
                namaPerusahaan: formData.namaPerusahaan,
              }
            : acc
        )
      );
    } else {
      // Create new account
      const newAccount: Account = {
        id: accounts.length + 1,
        email: formData.email,
        tanggalDibuat: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        namaPerusahaan: formData.namaPerusahaan,
        status: true,
      };
      setAccounts([...accounts, newAccount]);
    }

    // Reset form and close modal
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      namaPerusahaan: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setFormData({
      email: account.email,
      password: "",
      confirmPassword: "",
      namaPerusahaan: account.namaPerusahaan,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id ? { ...acc, status: !acc.status } : acc
      )
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      namaPerusahaan: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarSuperAdmin
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header with Menu Button */}
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="px-6 lg:px-10 pb-10">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="font-['Poppins'] font-bold text-3xl text-gray-900 mb-6">
                Akun Terdaftar
              </h1>

              <div className="flex justify-between items-center gap-4">
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari Akun..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent"
                  />
                </div>

                {/* Buat Akun Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-white border-2 border-gray-900 rounded-lg font-['Poppins'] font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Buat Akun
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
            <thead className="bg-[#1a5f7a] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">
                  No
                </th>
                <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">
                  Tanggal Dibuat
                </th>
                <th className="px-6 py-4 text-left font-['Poppins'] font-semibold text-sm">
                  Nama Perusahaan
                </th>
                <th className="px-6 py-4 text-center font-['Poppins'] font-semibold text-sm">
                  Action
                </th>
                <th className="px-6 py-4 text-center font-['Poppins'] font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={account.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                    {account.email}
                  </td>
                  <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                    {account.tanggalDibuat}
                  </td>
                  <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                    {account.namaPerusahaan}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleToggleStatus(account.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          account.status ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            account.status ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Title */}
            <h2 className="font-['Poppins'] font-semibold text-2xl text-[#1a5f7a] mb-6 text-center">
              {editingId ? "Edit Akun" : "Buat Akun"}
            </h2>

            {/* Form */}
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-6 py-3 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-6 py-3 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent"
              />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Konfirmasi Password"
                className="w-full px-6 py-3 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent"
              />

              <input
                type="text"
                name="namaPerusahaan"
                value={formData.namaPerusahaan}
                onChange={handleInputChange}
                placeholder="Nama Perusahaan"
                className="w-full px-6 py-3 border border-gray-300 rounded-full font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#277ba7] focus:border-transparent"
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full mt-6 px-6 py-3 bg-[#1a5f7a] text-white rounded-full font-['Poppins'] font-medium hover:bg-[#144a5e] transition-colors"
              >
                {editingId ? "Simpan Perubahan" : "Buat akun"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
