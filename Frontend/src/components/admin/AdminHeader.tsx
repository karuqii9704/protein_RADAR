'use client';

import { Bell, Search, User, Menu } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: 'Laporan baru ditambahkan', time: '5 menit lalu', unread: true },
    { id: 2, title: 'Berita berhasil dipublikasi', time: '1 jam lalu', unread: true },
    { id: 3, title: 'Artikel draft tersimpan', time: '2 jam lalu', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
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
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                        notif.unread ? 'bg-green-50/50' : ''
                      }`}
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
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-green-600 font-medium hover:text-green-700">
                    Lihat Semua Notifikasi
                  </button>
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
                  <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition">
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
