"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarAdk from "@/app/components/sidebar-adk";
import { Menu, ArrowUpRight } from "lucide-react";
import { useAuth, useRequireAuth } from '@/lib/auth-context';

export default function BerandaAdkPage() {
  useRequireAuth(['secretary']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    suratMasuk: { created: 0, total: 0 },
    suratKeluar: { created: 0, total: 0 },
    memo: { created: 0, total: 0 },
    notulensi: { created: 0, total: 0 },
  });
  const [priorityLetters, setPriorityLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        // Fetch statistics
        try {
          const statsResponse = await fetch('/api/approver/dashboard/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (statsResponse.ok && isMounted) {
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setStats(statsData.data);
            }
          }
        } catch (err) {
          console.error('Error fetching stats:', err);
        }

        // Fetch priority letters
        try {
          const priorityResponse = await fetch('/api/approver/dashboard/priority-letters', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (priorityResponse.ok && isMounted) {
            const priorityData = await priorityResponse.json();
            if (priorityData.success) {
              setPriorityLetters(priorityData.data);
            }
          }
        } catch (err) {
          console.error('Error fetching priority letters:', err);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLetterClick = (letter: any) => {
    const routes: Record<string, string> = {
      'incoming_mail': '/adk/surat-masuk',
      'outgoing_mail': '/adk/surat-keluar',
      'memo': '/adk/memo',
      'notulensi': '/adk/notulensi',
    };

    const route = routes[letter.type];
    if (route) {
      router.push(`${route}?id=${letter.id}`);
    }
  };

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const notifications = [
    {
      id: 1,
      type: "surat",
      title: "Surat Masuk Baru",
      message: "Surat undangan rapat dari Departemen Hubungan Internal",
      date: "30 Des 2025",
      time: "10:30",
      isRead: false,
      status: "pending",
    },
    {
      id: 2,
      type: "memo",
      title: "Memo Persetujuan",
      message: "Memo Anda telah disetujui oleh atasan",
      date: "29 Des 2025",
      time: "14:20",
      isRead: false,
      status: "approved",
    },
    {
      id: 3,
      type: "notulensi",
      title: "Notulensi Rapat",
      message: "Notulensi rapat mingguan telah selesai",
      date: "28 Des 2025",
      time: "16:45",
      isRead: true,
      status: "completed",
    },
  ];

  const statsCards = [
    {
      id: 1,
      title: "Total Surat Masuk",
      count: `${stats.suratMasuk.created}/${stats.suratMasuk.total}`,
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalSuratMasuk.svg",
      route: "/adk/surat-masuk",
    },
    {
      id: 2,
      title: "Total Surat Keluar",
      count: `${stats.suratKeluar.created}/${stats.suratKeluar.total}`,
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalSuratKeluar.svg",
      route: "/adk/surat-keluar",
    },
    {
      id: 3,
      title: "Total Memo",
      count: `${stats.memo.created}/${stats.memo.total}`,
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/totalMemo.svg",
      route: "/adk/memo",
    },
    {
      id: 4,
      title: "Total Notulensi",
      count: `${stats.notulensi.created}/${stats.notulensi.total}`,
      bgGradient: "from-[#0f3041] to-[#277ba7]",
      icon: "/suratNotulensi.svg",
      route: "/adk/notulensi",
    },
  ];

  const suratPrioritasTinggi = priorityLetters;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdk
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Poppins'] font-semibold text-black text-[32px] leading-tight">
              Beranda
            </h1>
            <p className="font-['Poppins'] font-normal text-black text-lg mt-1">
              Hai, Selamat Datang Super User !
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statsCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                className={`relative w-full h-[189px] rounded-[20px] bg-gradient-to-b ${card.bgGradient} p-5 cursor-pointer hover:opacity-90 transition-opacity`}
              >
                {/* Icon di kiri atas */}
                <div className="w-[50px] h-[50px] mb-4">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={50}
                    height={50}
                  />
                </div>

                {/* Icon panah di kanan atas */}
                <div className="absolute top-5 right-5">
                  <ArrowUpRight size={24} className="text-white" />
                </div>

                <h3 className="font-['Poppins'] font-medium text-white text-xl mb-2">
                  {card.title}
                </h3>
                <p className="font-['Montserrat'] font-semibold text-white text-[35px]">
                  {card.count}
                </p>
              </div>
            ))}
          </div>

          {/* Surat Prioritas Tinggi */}
          <div className="bg-white rounded-[25px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.15)] p-6 md:p-8">
            <h2 className="font-['Poppins'] font-semibold text-[#2F5D76] text-xl mb-6">
              Surat Prioritas Tinggi
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : suratPrioritasTinggi.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada surat prioritas tinggi</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                {suratPrioritasTinggi.map((surat) => (
                  <div
                    key={`${surat.type}-${surat.id}`}
                    onClick={() => handleLetterClick(surat)}
                    className="border-l-[6px] border-red-500 bg-white pl-4 pr-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-['Poppins'] text-sm text-gray-700 mb-1">
                          {surat.nomor}
                        </p>
                        <h3 className="font-['Poppins'] font-semibold text-base text-gray-900 mb-1">
                          {surat.title}
                        </h3>
                        <p className="font-['Poppins'] text-sm text-gray-700">
                          {surat.pembuat} | {surat.category}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-['Poppins'] font-medium rounded-md whitespace-nowrap">
                          {surat.status}
                        </span>
                        <p className="font-['Poppins'] text-sm text-gray-700 mt-2">
                          {surat.tanggal}
                        </p>
                        {surat.approver && surat.approver !== '-' && (
                          <p className="font-['Poppins'] text-sm text-gray-700">
                            Approver : {surat.approver}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
