"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus, X } from "lucide-react";

export default function DepartemenPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    namaDepartemen: "",
    kodeDepartemen: ""
  });

  const [tableData, setTableData] = useState([
    { namaDepartemen: "HRD", kodeDepartemen: "117", status: true },
    { namaDepartemen: "IT Support", kodeDepartemen: "153", status: true },
    { namaDepartemen: "Eksternal", kodeDepartemen: "209", status: false },
    { namaDepartemen: "Internal", kodeDepartemen: "303", status: true },
    { namaDepartemen: "Marketing", kodeDepartemen: "404", status: false },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editIndex !== null) {
      const newData = [...tableData];
      newData[editIndex] = { ...newData[editIndex], ...formData };
      setTableData(newData);
    } else {
      setTableData([...tableData, { ...formData, status: true }]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
    setFormData({ namaDepartemen: "", kodeDepartemen: "" });
  };

  const handleEdit = (index: number) => {
    setFormData({
      namaDepartemen: tableData[index].namaDepartemen,
      kodeDepartemen: tableData[index].kodeDepartemen
    });
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

  const handleToggleStatus = (index: number) => {
    const newData = [...tableData];
    newData[index].status = !newData[index].status;
    setTableData(newData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
    setFormData({ namaDepartemen: "", kodeDepartemen: "" });
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
              Departemen
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
                  placeholder="Cari Departemen ..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors whitespace-nowrap"
                onClick={() => setIsModalOpen(true)}
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
                      Nama Departemen
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">
                      Kode Departemen
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center">
                      Action
                    </th>
                    <th className="font-['Poppins'] font-medium text-xs md:text-sm py-3 px-4 text-center rounded-tr-[10px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.namaDepartemen}
                      </td>
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center text-black">
                        {row.kodeDepartemen}
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
                      <td className="font-['Poppins'] font-normal text-xs md:text-sm py-3 px-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.status}
                            onChange={() => handleToggleStatus(index)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#56F2A7]"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit Departemen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[25px] w-full max-w-md p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
            
            <h2 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-2xl mb-6">
              {isEditMode ? "Edit Departemen" : "Tambah Departemen"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                  Nama Departemen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaDepartemen}
                  onChange={(e) => setFormData({...formData, namaDepartemen: e.target.value})}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                  placeholder="Masukkan nama departemen"
                  required
                />
              </div>

              <div>
                <label className="font-['Poppins'] font-medium text-[#424141] text-sm block mb-2">
                  Kode Departemen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.kodeDepartemen}
                  onChange={(e) => setFormData({...formData, kodeDepartemen: e.target.value})}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-2 focus:ring-[#4180a9]/20"
                  placeholder="Masukkan kode departemen"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors"
                >
                  {isEditMode ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[25px] w-full max-w-md p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h2 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-2xl mb-2">
                Hapus Departemen?
              </h2>
              <p className="font-['Poppins'] text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus departemen ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 h-12 bg-red-500 text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
