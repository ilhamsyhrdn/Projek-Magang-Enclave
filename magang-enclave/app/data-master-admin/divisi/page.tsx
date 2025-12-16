"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Pencil, Trash2 } from "lucide-react";

export default function DivisiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tableData = [
    { 
      nama: "Ga, IT & Procurement", 
      alamat: "Addres 0", 
      telepon: "081239058201S", 
      date: "13 Agustus 2025" 
    },
    { 
      nama: "BOD Office", 
      alamat: "lorem ipsum sit", 
      telepon: "081239058201S", 
      date: "12 Agustus 2025" 
    },
    { 
      nama: "Development Office", 
      alamat: "lorem ipsum sit", 
      telepon: "081239058201S", 
      date: "10 Agustus 2025" 
    },
  ];

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
            <h1 className="font-['Poppins'] font-medium text-[#1e1e1e] text-3xl md:text-[40px] mb-2">
              Manajemen Divisi
            </h1>
            <p className="font-['Poppins'] font-light text-black text-base md:text-xl">
              lorem ipsum dolor sit amet lorem ipsum dolor sit amet
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Divisi ..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#205d7d] text-white">
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left rounded-tl-[10px]">
                      Nama Divisi
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left">
                      Alamat Divisi
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left">
                      Nomor Telepon
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left">
                      Date
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left rounded-tr-[10px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.nama}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.alamat}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.telepon}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.date}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil size={18} className="text-orange-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
    </div>
  );
}
