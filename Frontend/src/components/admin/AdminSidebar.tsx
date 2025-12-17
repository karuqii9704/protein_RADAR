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
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { useState } from "react";

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
    href: "/admin/settings",
    label: "Pengaturan",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col transition-all duration-300 shadow-2xl`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-lg leading-tight">
                Admin Panel
              </h1>
              <p className="text-slate-400 text-xs">Masjid Syamsul 'Ulum</p>
            </div>
          )}
        </Link>
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
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  active ? "text-white" : "group-hover:text-green-400"
                }`}
              />
              {!collapsed && <span className="font-medium">{item.label}</span>}
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
          title={collapsed ? "Kembali ke Website" : undefined}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="font-medium">Kembali ke Website</span>
          )}
        </Link>

        {/* Logout */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
