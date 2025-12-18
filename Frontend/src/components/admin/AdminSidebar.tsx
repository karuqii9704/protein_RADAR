"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  BookOpen,
  HandHeart,
  Settings,
  LogOut,
  Home,
  X,
  Users,
  Image,
} from "lucide-react";

interface AdminSidebarProps {
  onClose?: () => void;
}

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/laporan",
    label: "Laporan Keuangan",
    icon: FileText,
  },
  {
    href: "/admin/berita",
    label: "Berita",
    icon: Newspaper,
  },
  {
    href: "/admin/artikel",
    label: "Artikel",
    icon: BookOpen,
  },
  {
    href: "/admin/program",
    label: "Program",
    icon: HandHeart,
  },
  {
    href: "/admin/slides",
    label: "Carousel",
    icon: Image,
  },
  {
    href: "/admin/users",
    label: "Kelola Admin",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "Pengaturan",
    icon: Settings,
  },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">
              Admin Panel
            </h1>
            <p className="text-slate-400 text-xs">Masjid Syamsul 'Ulum</p>
          </div>
        </Link>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/25"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  active ? "text-white" : "group-hover:text-green-400"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        {/* Back to Website */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Kembali ke Website</span>
        </Link>

        {/* Logout */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
