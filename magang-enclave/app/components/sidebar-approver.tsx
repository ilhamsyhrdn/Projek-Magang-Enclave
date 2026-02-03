"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, X, User, Trash2 } from "lucide-react";
import {
  LayoutDashboard,
  Mail,
  Send,
  FileText,
  Clipboard,
  List,
  Archive,
  LogOut
} from "lucide-react";

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  documentId: number | null;
  status: string | null;
  isRead: boolean;
  createdAt: string;
}

interface SidebarApproverProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarApprover({
  isOpen,
  onToggle,
}: SidebarApproverProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [filterToday, setFilterToday] = useState(false);
  const [imageError, setImageError] = useState({
    logo: false,
    avatar: false
  });

  const { user, isLoading } = useAuth();
  const { logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

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
    // Mark as read
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notification.id }),
      });

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }

    // Redirect based on type
    const typeRoutes: { [key: string]: string } = {
      'surat-keluar': `/approver/surat-keluar?id=${notification.documentId}`,
      'surat-masuk': `/approver/surat-masuk?id=${notification.documentId}`,
      'memo': `/approver/memo?id=${notification.documentId}`,
      'notulensi': `/approver/notulensi?id=${notification.documentId}`,
    };

    const route = typeRoutes[notification.type];
    if (route) {
      setIsNotificationOpen(false);
      router.push(route);
    }
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

  const formatRole = (role: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
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
              {isLoading ? (
                <p className="font-['Poppins'] font-medium text-gray-400 text-[15px] truncate">
                  Memuat...
                </p>
              ) : (
                <p className="font-['Poppins'] font-medium text-black text-[15px] truncate">
                  {user?.fullName || 'User'}
                </p>
              )}

              {isLoading ? (
                <p className="font-['Poppins'] font-light text-gray-400 text-[8px]">
                  Memuat...
                </p>
              ) : (
                <p className="font-['Poppins'] font-light text-black text-[8px]">
                  {formatRole(user?.role || 'guest')}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Bell size={20} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Beranda */}
          <Link
            href="/approver/beranda"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/beranda" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <LayoutDashboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Beranda
            </span>
          </Link>

          {/* Surat Masuk */}
          <Link
            href="/approver/surat-masuk"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/surat-masuk" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Mail size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Surat Masuk
            </span>
          </Link>

          {/* Surat Keluar */}
          <Link
            href="/approver/surat-keluar"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/surat-keluar" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Send size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Surat Keluar
            </span>
          </Link>

          {/* Memo */}
          <Link
            href="/approver/memo"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/memo" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <FileText size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Memo
            </span>
          </Link>

          {/* Notulensi */}
          <Link
            href="/approver/notulensi"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname === "/approver/notulensi" ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Clipboard size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Notulensi
            </span>
          </Link>

          {/* Daftar Surat */}
          <Link
            href="/approver/daftar-surat/surat-masuk"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname.startsWith("/approver/daftar-surat") ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <List size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Daftar Surat
            </span>
          </Link>

          {/* Arsip */}
          <Link
            href="/approver/arsip"
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors
              ${pathname.startsWith("/approver/arsip") ? "bg-[#bcdff6]" : "hover:bg-gray-50"}
            `}
          >
            <Archive size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Arsip
            </span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-4 pb-8 pt-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} className="text-[#1E1E1E] flex-shrink-0" />
            <span className="font-['Poppins'] text-black text-[14px] font-normal">
              Log Out
            </span>
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[60] lg:z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setIsNotificationOpen(false);
              setSelectedNotifications([]);
            }}
          />
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-['Poppins'] font-semibold text-xl">
                  Notifikasi
                </h2>
                <button
                  onClick={() => {
                    setIsNotificationOpen(false);
                    setSelectedNotifications([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-200 flex gap-2 flex-wrap">
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
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg font-['Poppins'] text-xs hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Hapus ({selectedNotifications.length})
                    </button>
                  )}
                  <button
                    onClick={handleDeleteAll}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg font-['Poppins'] text-xs hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Hapus Semua
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4">
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
