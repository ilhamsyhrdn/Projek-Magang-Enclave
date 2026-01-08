"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X } from "lucide-react";

export default function PegawaiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    idPegawai: "",
    namaLengkap: "",
    email: "",
    divisi: "",
    departemen: ""
  });

  const [tableData, setTableData] = useState([
    { idPegawai: "001", namaLengkap: "Budiono Siregar", email: "budioniosiregar@gmail.com", divisi: "Keuangan", departemen: "Keuangan" },
    { idPegawai: "002", namaLengkap: "Chandra Wibawa", email: "chndraWib@gmail.com", divisi: "SDM", departemen: "HRD" },
    { idPegawai: "003", namaLengkap: "Evan Ahnaf", email: "evannahnaf@gmail.com", divisi: "Public Relation", departemen: "Internal" },
    { idPegawai: "004", namaLengkap: "Rayhan Nugrah", email: "rayhanug@erockel.com", divisi: "Public Relation", departemen: "Eksternal" },
    { idPegawai: "005", namaLengkap: "ilhamsyah", email: "ilhamsyah@yahoo.com", divisi: "Public Relation", departemen: "Eksternal" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editIndex !== null) {
      const newData = [...tableData];
      newData[editIndex] = formData;
      setTableData(newData);
    } else {
      setTableData([...tableData, formData]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
    setFormData({ idPegawai: "", namaLengkap: "", email: "", divisi: "", departemen: "" });
  };

  const handleEdit = (index: number) => {
    setFormData(tableData[index]);
    setEditIndex(index);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newData = tableData.filter((_, i) => i !== deleteIndex);
      setTableData(newData);
    }
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
    setFormData({ idPegawai: "", namaLengkap: "", email: "", divisi: "", departemen: "" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header with Menu Button */}
        <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 lg:px-10 pb-10">
          {/* Page Title */}
          <div className="mb-6 md:mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px]">
              Pegawai
            </h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Search Bar and Tambah Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Pegawai ..."
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#205d7d] text-white">
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tl-[10px]">
                      id_Pegawai
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">
                      Nama Lengkap
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">
                      Email
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">
                      Divisi
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">
                      Departemen
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-[10px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.idPegawai}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.namaLengkap}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.email}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.divisi}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.departemen}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil size={18} className="text-orange-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} className="text-red-500" />
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
      </div>

      {/* Modal Tambah/Edit Pegawai */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[25px] w-full max-w-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>

            <h2 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-2xl mb-6">
              {isEditMode ? "Edit Pegawai" : "Tambah Pegawai"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                    ID Pegawai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idPegawai}
                    onChange={(e) => setFormData({...formData, idPegawai: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder="Masukkan ID Pegawai"
                    required
                  />
                </div>

                <div>
                  <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div>
                  <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                    Divisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.divisi}
                    onChange={(e) => setFormData({...formData, divisi: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder="Masukkan divisi"
                    required
                  />
                </div>

                <div>
                  <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                    Departemen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.departemen}
                    onChange={(e) => setFormData({...formData, departemen: e.target.value})}
                    className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                    placeholder="Masukkan departemen"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors"
                >
                  {isEditMode ? "Simpan Perubahan" : "Tambah Pegawai"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[25px] p-8 max-w-md w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="font-['Poppins'] font-semibold text-xl text-[#1e1e1e] mb-2">
                Hapus Pegawai
              </h3>
              <p className="font-['Poppins'] text-sm text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus pegawai ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
