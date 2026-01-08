"use client";

import { useState } from "react";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu, Search, ChevronDown, Calendar, X } from "lucide-react";

interface ArsipData {
  id: number;
  no: number;
  nomerSurat: string;
  perihalSurat: string;
  pengirim: string;
  tanggalSurat: string;
  tanggalDibuat: string;
  approver: string;
  kategori: "Surat Masuk" | "Surat Keluar" | "Memo" | "Notulensi";
}

export default function ArsipUserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Surat Masuk" | "Surat Keluar" | "Memo" | "Notulensi">("Surat Masuk");
  const [startDate, setStartDate] = useState("09 Des 25");
  const [endDate, setEndDate] = useState("10 Des 25");
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Sample data - replace with actual data from API
  const arsipData: ArsipData[] = [
    {
      id: 1,
      no: 1,
      nomerSurat: "01/C111/107/11/2025",
      perihalSurat: "Surat Keluar - POP",
      pengirim: "Jhon Doe",
      tanggalSurat: "12 Des 25",
      tanggalDibuat: "12 Des 25",
      approver: "Budiono Siregar",
      kategori: "Surat Masuk"
    },
    {
      id: 2,
      no: 2,
      nomerSurat: "02/C111/107/12/2025",
      perihalSurat: "Surat Keluar - POP",
      pengirim: "Jhon Doe",
      tanggalSurat: "10 Des 25",
      tanggalDibuat: "30 Mar 25",
      approver: "Ilhamsyah",
      kategori: "Surat Masuk"
    },
    {
      id: 3,
      no: 3,
      nomerSurat: "04/C111/107/12/2025",
      perihalSurat: "Surat Keluar - POP",
      pengirim: "Jhon Doe",
      tanggalSurat: "13 Mar 25",
      tanggalDibuat: "13 Feb 25",
      approver: "Chandra Wibawa",
      kategori: "Surat Masuk"
    },
    {
      id: 4,
      no: 1,
      nomerSurat: "05/C111/107/11/2025",
      perihalSurat: "Surat Keluar - POP",
      pengirim: "Jane Doe",
      tanggalSurat: "15 Des 25",
      tanggalDibuat: "15 Des 25",
      approver: "Ahmad Rizki",
      kategori: "Surat Keluar"
    },
    {
      id: 5,
      no: 1,
      nomerSurat: "01/M111/12/2025",
      perihalSurat: "Memo Pengajuan Dana",
      pengirim: "Staff Keuangan",
      tanggalSurat: "06 Des 25",
      tanggalDibuat: "06 Des 25",
      approver: "Manager",
      kategori: "Memo"
    },
    {
      id: 6,
      no: 1,
      nomerSurat: "100/N11/M1/2025",
      perihalSurat: "Rapat Internal iFest",
      pengirim: "Ilhamsyah",
      tanggalSurat: "03 Nov 25",
      tanggalDibuat: "03 Nov 25",
      approver: "Direktur",
      kategori: "Notulensi"
    },
  ];

  // Filter data based on active tab
  const filteredData = arsipData.filter(item => item.kategori === activeTab);

  // Filter by search query
  const searchedData = filteredData.filter(item => 
    item.nomerSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.perihalSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.approver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = ["Surat Masuk", "Surat Keluar", "Memo", "Notulensi"] as const;

  // Function to truncate text and add ..
  const truncateText = (text: string, maxLength: number = 12) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..";
    }
    return text;
  };

  // Function to handle click on truncated text
  const handleTextClick = (fullText: string, event: React.MouseEvent<HTMLSpanElement>) => {
    if (fullText.length > 12) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setTooltipContent(fullText);
    }
  };

  // Function to close tooltip
  const closeTooltip = () => {
    setTooltipContent(null);
    setTooltipPosition(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[269px]' : 'lg:ml-0'}`}>
        {/* Header with Menu Button */}
        <div className="bg-gray-50 py-4 px-6 lg:px-10">
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
          <h1 className="font-['Poppins'] font-semibold text-2xl text-[#1e1e1e] mb-6">
            Arsip
          </h1>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-['Poppins'] text-sm pb-3 transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#4180a9] font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4180a9]" />
                )}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari surat, no surat ..."
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-[12px] font-['Poppins'] text-sm focus:outline-none focus:border-[#4180a9] focus:ring-1 focus:ring-[#4180a9]"
              />
            </div>
            <button className="px-4 h-12 border border-gray-300 rounded-[12px] hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ChevronDown size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 px-4 h-12 border border-gray-300 rounded-[12px] bg-white">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-20 font-['Poppins'] text-sm focus:outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-20 font-['Poppins'] text-sm focus:outline-none"
              />
              <Calendar size={20} className="text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#4180a9] text-white">
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      No
                    </th>
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      Nomer Surat
                    </th>
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      Perihal Surat
                    </th>
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      Pengirim
                    </th>
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      Tanggal Surat
                    </th>
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-4 text-left font-['Poppins'] text-sm font-semibold">
                      Approver
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchedData.length > 0 ? (
                    searchedData.map((item, index) => (
                      <tr 
                        key={item.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          {item.no}
                        </td>
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          {item.nomerSurat}
                        </td>
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          <span
                            onClick={(e) => handleTextClick(item.perihalSurat, e)}
                            className={item.perihalSurat.length > 12 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}
                          >
                            {truncateText(item.perihalSurat)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          <span
                            onClick={(e) => handleTextClick(item.pengirim, e)}
                            className={item.pengirim.length > 12 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}
                          >
                            {truncateText(item.pengirim)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          {item.tanggalSurat}
                        </td>
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          {item.tanggalDibuat}
                        </td>
                        <td className="px-6 py-4 font-['Poppins'] text-sm text-gray-900">
                          <span
                            onClick={(e) => handleTextClick(item.approver, e)}
                            className={item.approver.length > 12 ? "cursor-pointer hover:text-[#4180a9] transition-colors" : ""}
                          >
                            {truncateText(item.approver)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center font-['Poppins'] text-sm text-gray-500">
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip Modal */}
      {tooltipContent && tooltipPosition && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeTooltip}
          />
          
          {/* Tooltip */}
          <div
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-['Poppins'] text-sm text-gray-900 break-words">
                {tooltipContent}
              </p>
              <button
                onClick={closeTooltip}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
