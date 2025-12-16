"use client";

import { useState } from "react";
import SidebarUser from "@/app/components/sidebar-user";
import { Menu } from "lucide-react";

export default function BerandaUserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser
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
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
          <div className="text-center">
            <h1 className="font-['Poppins'] font-semibold text-[#1e1e1e] text-4xl md:text-5xl lg:text-6xl mb-4">
              Welcome back!
            </h1>
            <h2 className="font-['Poppins'] font-bold text-[#1e1e1e] text-3xl md:text-4xl lg:text-5xl">
              {"{Super User}"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
