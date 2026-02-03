"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Bell, X, User, Trash2 } from "lucide-react";

interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  status: string | null;
  isRead: boolean;
  createdAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarSuperAdmin({
  isOpen,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [imageError, setImageError] = useState({
    logo: false,
    avatar: false
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [filterToday, setFilterToday] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notification.id }),
      });

      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }

    const typeRoutes: { [key: string]: string } = {
      'system': '/dashboard-superAdmin',
    };

    const route = typeRoutes[notification.type] || '/dashboard-superAdmin';
    setIsNotificationOpen(false);
    router.push(route);
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: selectedNotifications }),
      });

      if (response.ok) {
        await fetchNotifications();
        setSelectedNotifications([]);
      }
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;

    if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
      try {
        const response = await fetch('/api/notifications', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deleteAll: true }),
        });

        if (response.ok) {
          await fetchNotifications();
          setSelectedNotifications([]);
        }
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
      }
    }
  };

  const toggleSelectNotification = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed z-50
        w-[269px] h-screen bg-white
        rounded-br-[25px] rounded-tr-[25px]
        shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)]
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="relative w-full h-[50px]">
            {!imageError.logo ? (
              <Image
                src="/logo.png"
                alt="Enclave Logo"
                fill
                className="object-contain object-left"
                priority
                onError={() => setImageError(prev => ({ ...prev, logo: true }))}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-start">
                <span className="font-['Poppins'] font-bold text-xl text-blue-600">
                  ENCLAVE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="relative px-5 pb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[39px] h-[39px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
              {!imageError.avatar ? (
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  width={39}
                  height={39}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(prev => ({ ...prev, avatar: true }))}
                  unoptimized
                />
              ) : (
                <User size={24} className="text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-['Poppins'] font-medium text-black text-[15px] truncate">
                Super Administrator
              </p>
              <p className="font-['Poppins'] font-light text-black text-[8px]">
                Enclave
              </p>
            </div>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Bell size={20} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Account */}
          <Link
            href="/dashboard-superAdmin"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg
              font-['Poppins'] text-[14px] transition-all
              ${
                pathname === "/dashboard-superAdmin"
                  ? "bg-[#b8d7e8] text-black font-medium"
                  : "text-[#1E1E1E] hover:bg-gray-100"
              }
            `}
          >
            <LayoutGrid size={20} />
            <span>Account</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 flex-shrink-0 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-lg font-['Poppins'] text-[14px] text-[#1E1E1E] hover:bg-gray-100 transition-all"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Notification Modal */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsNotificationOpen(false)}
          />
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-['Poppins'] font-semibold text-xl">
                  Notifikasi
                </h2>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {notifications.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button
                      onClick={() => setFilterToday(!filterToday)}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm font-['Poppins'] ${
                        filterToday
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {filterToday ? '\u2713 Hari Ini' : 'Hari Ini'}
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={selectedNotifications.length === 0}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-['Poppins']"
                    >
                      <Trash2 size={16} />
                      Hapus Dipilih ({selectedNotifications.length})
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-['Poppins']"
                    >
                      <Trash2 size={16} />
                      Hapus Semua
                    </button>
                  </div>
                )}

                {(() => {
                  const filteredNotifications = filterToday
                    ? notifications.filter(notif => {
                        const notifDate = new Date(notif.createdAt);
                        const today = new Date();
                        return notifDate.toDateString() === today.toDateString();
                      })
                    : notifications;

                  return filteredNotifications.length > 0 ? (
                    <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                      {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-all ${
                          notification.isRead
                            ? "bg-white border-gray-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => toggleSelectNotification(notification.id)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />

                          {/* Content */}
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-['Poppins'] font-medium text-black text-sm">
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 font-['Poppins'] mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {notification.status && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-['Poppins'] ${
                                    notification.status === "Ditolak"
                                      ? "bg-red-100 text-red-600"
                                      : notification.status === "Dalam Proses"
                                      ? "bg-orange-100 text-orange-600"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  {notification.status}
                                </span>
                              )}
                              {!notification.isRead && (
                                <span className="px-2 py-1 rounded-full text-xs font-['Poppins'] bg-red-100 text-red-600">
                                  Baru
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Bell size={48} className="mb-2" />
                    <p className="font-['Poppins']">
                      {filterToday ? 'Tidak ada notifikasi hari ini' : 'Tidak ada notifikasi'}
                    </p>
                  </div>
                );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
