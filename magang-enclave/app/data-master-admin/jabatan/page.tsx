"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2, Plus } from "lucide-react";

export default function JabatanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    namaJabatan: "",
    tingkatJabatan: "",
    deskripsi: ""
  });

  const tableData = [
    {
      namaJabatan: "Ketua",
      tingkatJabatan: "Struktural - Tingkat 1",
      deskripsi: "Pemimpin tertinggi organisasi"
    },
    {
      namaJabatan: "Wakil Ketua",
      tingkatJabatan: "Struktural - Tingkat 1",
      deskripsi: "Wakil pemimpin organisasi"
    },
    {
      namaJabatan: "Sekretaris",
      tingkatJabatan: "Struktural - Tingkat 2",
      deskripsi: "Kepala Divisi Administrasi dan Kesekretariatan"
    },
    {
      namaJabatan: "Ketua Divisi Internal",
      tingkatJabatan: "Struktural - Tingkat 2",
      deskripsi: "Kepala Divisi Internal"
    },
    {
      namaJabatan: "Ketua Divisi Eksternal",
      tingkatJabatan: "Struktural - Tingkat 2",
      deskripsi: "Kepala Divisi Eksternal"
    },
    {
      namaJabatan: "Ketua Divisi Akademik & Profesi",
      tingkatJabatan: "Struktural - Tingkat 2",
      deskripsi: "Kepala Divisi Akademik & Profesi"
    },
    {
      namaJabatan: "Ketua Divisi Ekonomi & Bisnis",
      tingkatJabatan: "Struktural - Tingkat 2",
      deskripsi: "Kepala Divisi Ekonomi & Bisnis"
    },
    {
      namaJabatan: "Ketua Departemen Pengembangan Organisasi",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Pengembangan Organisasi"
    },
    {
      namaJabatan: "Ketua Departemen Ketertiban Internal",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Ketertiban Internal"
    },
    {
      namaJabatan: "Ketua Departemen Hubungan Internal",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Hubungan Internal"
    },
    {
      namaJabatan: "Ketua Departemen Hubungan Eksternal",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Hubungan Eksternal"
    },
    {
      namaJabatan: "Ketua Departemen Sosial",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Sosial"
    },
    {
      namaJabatan: "Ketua Departemen Media Informasi",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Media Informasi"
    },
    {
      namaJabatan: "Ketua Departemen Kelimuan",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Kelimuan"
    },
    {
      namaJabatan: "Ketua Departemen Keprofesian",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Keprofesian"
    },
    {
      namaJabatan: "Ketua Departemen Pengembangan Teknologi & Informasi",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Pengembangan Teknologi & Informasi"
    },
    {
      namaJabatan: "Ketua Departemen Minat Bakat",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Minat Bakat"
    },
    {
      namaJabatan: "Ketua Departemen Keuangan",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Keuangan"
    },
    {
      namaJabatan: "Ketua Departemen Kewirausahaan",
      tingkatJabatan: "Struktural - Tingkat 3",
      deskripsi: "Kepala Departemen Kewirausahaan"
    },
    {
      namaJabatan: "Anggota",
      tingkatJabatan: "Non-Struktural",
      deskripsi: "Anggota organisasi"
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
    setFormData({
      namaJabatan: "",
      tingkatJabatan: "",
      deskripsi: ""
    });
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
              Jabatan/Posisi
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
                  placeholder="Cari Jabatan ..."
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
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">No</th>
                    <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Nama Jabatan</th>
                    <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Tingkat Jabatan</th>
                    <th className="px-4 py-3 text-left font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Deskripsi</th>
                    <th className="px-4 py-3 text-center font-['Poppins'] font-semibold text-sm text-[#1e1e1e]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{index + 1}</td>
                      <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{row.namaJabatan}</td>
                      <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{row.tingkatJabatan}</td>
                      <td className="px-4 py-4 font-['Poppins'] text-sm text-[#1e1e1e]">{row.deskripsi}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[25px] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-['Poppins'] font-semibold text-2xl text-[#1e1e1e] mb-6">
              Tambah Jabatan
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">
                    Nama Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.namaJabatan}
                    onChange={(e) => setFormData({ ...formData, namaJabatan: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">
                    Tingkat Jabatan
                  </label>
                  <select
                    value={formData.tingkatJabatan}
                    onChange={(e) => setFormData({ ...formData, tingkatJabatan: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    required
                  >
                    <option value="">Pilih Tingkat Jabatan</option>
                    <option value="Struktural - Tingkat 1">Struktural - Tingkat 1</option>
                    <option value="Struktural - Tingkat 2">Struktural - Tingkat 2</option>
                    <option value="Struktural - Tingkat 3">Struktural - Tingkat 3</option>
                    <option value="Non-Struktural">Non-Struktural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-['Poppins'] text-sm font-medium text-[#1e1e1e] mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#4180a9] text-white rounded-[10px] font-['Poppins'] font-medium text-sm hover:bg-[#356890] transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
