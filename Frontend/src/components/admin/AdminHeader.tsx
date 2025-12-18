'use client';

import { Bell, Search, User, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  createdAt: string;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications dynamically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch recent activities from admin dashboard API
        const res = await apiGet<{ recentActivities: RecentActivity[] }>('/api/admin/dashboard/stats');
        if (res.success && res.data?.recentActivities) {
          const mapped = res.data.recentActivities.slice(0, 5).map((activity, index) => ({
            id: activity.id || String(index),
            title: activity.title,
            time: formatTimeAgo(activity.createdAt),
            unread: index < 2, // First 2 are unread
          }));
          setNotifications(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = async () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2.5 w-80">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Cari laporan, berita, artikel..."
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Memuat...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                          notif.unread ? 'bg-green-50/50' : ''
                        }`}
                        onClick={() => {
                          setNotifications(prev => 
                            prev.map(n => n.id === notif.id ? { ...n, unread: false } : n)
                          );
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          )}
                          <div className={notif.unread ? '' : 'ml-5'}>
                            <p className="text-sm text-gray-900 font-medium">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">Admin Masjid</p>
                  <p className="text-sm text-gray-500">admin@msu.ac.id</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition">
                    Profil Saya
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition">
                    Pengaturan
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
