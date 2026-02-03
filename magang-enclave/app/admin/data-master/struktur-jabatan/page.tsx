"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, AlertCircle, Search, Edit2, Trash2, Plus } from "lucide-react";
import Image from "next/image";

interface StrukturJabatan {
  id: number;
  position_id: number;
  position_name: string;
  name: string;
  phone: string;
  email: string;
}

export default function StrukturJabatanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [strukturJabatan, setStrukturJabatan] = useState<StrukturJabatan[]>([]);
  const [positions, setPositions] = useState<{ id: number; name: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    position_id: "",
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchStrukturJabatan();
    fetchPositions();
  }, []);

  const fetchStrukturJabatan = async () => {
    try {
      const response = await fetch("/api/admin/organization-structure");
      const data = await response.json();
      if (response.ok) {
        setStrukturJabatan(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching struktur jabatan:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/admin/positions");
      const data = await response.json();
      if (response.ok) {
        console.log("Positions loaded:", data.data);
        setPositions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ position_id: "", name: "", phone: "", email: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (item: StrukturJabatan) => {
    setEditingId(item.id);
    setFormData({
      position_id: item.position_id.toString(),
      name: item.name,
      phone: item.phone,
      email: item.email,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/admin/organization-structure/${editingId}`
        : "/api/admin/organization-structure";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchStrukturJabatan();
        setIsFormOpen(false);
        setFormData({ position_id: "", name: "", phone: "", email: "" });
      }
    } catch (error) {
      console.error("Error saving struktur jabatan:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const response = await fetch(`/api/admin/organization-structure/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStrukturJabatan();
      }
    } catch (error) {
      console.error("Error deleting struktur jabatan:", error);
    }
  };

  const filteredData = strukturJabatan.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Main Content */}
        <div className="px-6 lg:px-10 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px]">
              Struktur Jabatan
            </h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[15px] shadow-sm border border-gray-200 overflow-hidden">
            {/* Organization Chart Image */}
            <div className="p-8">
              <div className="relative w-full bg-white rounded-lg overflow-hidden flex justify-center">
                <img
                  src="/strukturJabatan.jpeg"
                  alt="Struktur Organisasi"
                  className="w-full max-w-5xl h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-8 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Struktur Jabatan" : "Tambah Struktur Jabatan"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.position_id}
                  onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4180a9] text-sm bg-white"
                >
                  <option value="">Pilih Jabatan</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#305b6e] text-sm"
                  placeholder="Masukkan nama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#305b6e] text-sm"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#305b6e] text-sm"
                  placeholder="Masukkan email"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#4180a9] hover:bg-[#356890] text-white rounded-lg transition-all text-sm font-medium"
                >
                  {editingId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
