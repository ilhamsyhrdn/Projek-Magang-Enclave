"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import { Menu, Search, Calendar } from "lucide-react";

export default function ArsipPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("surat-masuk");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("08 Des 25");
  const [endDate, setEndDate] = useState("10 Des 25");

  const tabs = [
    { id: "surat-masuk", label: "Surat Masuk" },
    { id: "surat-keluar", label: "Surat Keluar" },
    { id: "memo", label: "Memo" },
    { id: "notulensi", label: "Notulensi" },
  ];

  const tableData = [
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Menunggu", statusColor: "#D9D9D9" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Diproses", statusColor: "#FFBD66" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Selesai", statusColor: "#56F2A7" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Menunggu", statusColor: "#D9D9D9" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Diproses", statusColor: "#FFBD66" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Selesai", statusColor: "#56F2A7" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Menunggu", statusColor: "#D9D9D9" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Diproses", statusColor: "#FFBD66" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Selesai", statusColor: "#56F2A7" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Selesai", statusColor: "#56F2A7" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Menunggu", statusColor: "#D9D9D9" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Selesai", statusColor: "#56F2A7" },
    { lorep: "lorem ipsum", dolorSit: "lorem ipsum sit", ipsumLor: "lorem ipsum sit", status: "Diproses", statusColor: "#FFBD66" },
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
              Daftar Surat
            </h1>
            <p className="font-['Poppins'] font-light text-black text-base md:text-xl">
              lorem ipsum dolor sit amet lorem ipsum dolor sit amet
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            {/* Tabs */}
            <div className="flex gap-4 md:gap-8 mb-6 border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-['Poppins'] text-sm md:text-base pb-3 px-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-[#4180a9] font-semibold border-b-2 border-[#4180a9]"
                      : "text-gray-500 font-normal"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Date Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari surat, no surat ..."
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[10px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
                />
              </div>

              {/* Date Range Picker */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-[10px] px-4 h-12 bg-white">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-20 md:w-24 font-['Poppins'] text-sm focus:outline-none text-center"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-20 md:w-24 font-['Poppins'] text-sm focus:outline-none text-center"
                />
                <Calendar size={20} className="text-gray-400" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#205d7d] text-white">
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left rounded-tl-[10px]">
                      Lorep
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left">
                      Dolor sit
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left">
                      Ipsum Lor
                    </th>
                    <th className="font-['Poppins'] font-medium text-sm md:text-base py-4 px-4 text-left rounded-tr-[10px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.lorep}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.dolorSit}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4 text-black">
                        {row.ipsumLor}
                      </td>
                      <td className="font-['Poppins'] font-normal text-sm md:text-base py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: row.statusColor }}
                          />
                          <span className="text-black">{row.status}</span>
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
