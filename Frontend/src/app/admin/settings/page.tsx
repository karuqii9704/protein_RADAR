'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  User, 
  Building, 
  CreditCard, 
  Bell, 
  Shield, 
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  X,
  Loader2,
  QrCode
} from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [qrisPreview, setQrisPreview] = useState<string | null>(null);
  const [qrisLoading, setQrisLoading] = useState(false);
  const [savingQris, setSavingQris] = useState(false);
  const qrisInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile', label: 'Profil Masjid', icon: Building },
    { id: 'account', label: 'Akun Admin', icon: User },
    { id: 'bank', label: 'Rekening & QRIS', icon: CreditCard },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
  ];

  // Fetch default QRIS on mount
  useEffect(() => {
    if (activeTab === 'bank') {
      fetchDefaultQris();
    }
  }, [activeTab]);

  const fetchDefaultQris = async () => {
    setQrisLoading(true);
    try {
      const res = await apiGet<{ default_qris?: string }>('/api/admin/settings', { key: 'default_qris' });
      if (res.success && res.data) {
        const setting = res.data as unknown as { value?: string };
        if (setting?.value) {
          setQrisPreview(setting.value);
        }
      }
    } catch (error) {
      console.error('Failed to fetch QRIS:', error);
    } finally {
      setQrisLoading(false);
    }
  };

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setQrisPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeQris = () => {
    setQrisPreview(null);
    if (qrisInputRef.current) {
      qrisInputRef.current.value = '';
    }
  };

  const saveQris = async () => {
    setSavingQris(true);
    try {
      const res = await apiPut('/api/admin/settings', {
        key: 'default_qris',
        value: qrisPreview || '',
      });

      if (res.success) {
        toast.success('QRIS default berhasil disimpan');
      } else {
        toast.error(res.error || 'Gagal menyimpan QRIS');
      }
    } catch (error) {
      console.error('Save QRIS error:', error);
      toast.error('Gagal menyimpan QRIS');
    } finally {
      setSavingQris(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 mt-1">Kelola pengaturan profil dan akun admin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Masjid */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-green-600" />
                Profil Masjid
              </h2>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    M
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Logo Masjid</h3>
                    <p className="text-sm text-gray-500 mb-3">PNG, JPG max 2MB</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Masjid</label>
                    <input
                      type="text"
                      defaultValue="Masjid Syamsul 'Ulum"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institusi</label>
                    <input
                      type="text"
                      defaultValue="Telkom University"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Alamat
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="Jl. Telekomunikasi No. 1, Terusan Buah Batu, Dayeuhkolot, Bandung, Jawa Barat 40257"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="masjid.msu@telkomuniversity.ac.id"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Telepon
                    </label>
                    <input
                      type="tel"
                      defaultValue="022-7564108"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    rows={3}
                    defaultValue="Masjid Syamsul 'Ulum adalah masjid utama di Telkom University yang menjadi pusat kegiatan keagamaan bagi civitas akademika."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition">
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Akun Admin
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      defaultValue="Admin Masjid"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue="admin"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@msu.ac.id"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition">
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bank & QRIS Settings */}
          {activeTab === 'bank' && (
            <div className="space-y-6">
              {/* Bank Account */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Rekening Bank
                </h2>

                <div className="space-y-4">
                  {/* Existing Account */}
                  <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-green-700">Rekening Utama</span>
                      <span className="px-2 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">Aktif</span>
                    </div>
                    <p className="font-bold text-gray-900 text-lg mb-1">Bank Syariah Indonesia (BSI)</p>
                    <p className="text-gray-600">7123456789 - Masjid Syamsul Ulum</p>
                  </div>

                  <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-400 hover:text-green-600 transition">
                    + Tambah Rekening Baru
                  </button>
                </div>
              </div>

              {/* QRIS Default */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-green-600" />
                  QRIS Default
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  QRIS ini akan digunakan untuk program donasi yang tidak memiliki QRIS khusus.
                </p>

                {qrisLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {qrisPreview ? (
                      <div className="relative w-full max-w-sm mx-auto">
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-200 bg-white p-4">
                          <Image
                            src={qrisPreview}
                            alt="QRIS Default"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeQris}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => qrisInputRef.current?.click()}
                        className="w-full max-w-sm mx-auto aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                      >
                        <QrCode className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Upload QRIS</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 2MB)</p>
                      </div>
                    )}

                    <input
                      ref={qrisInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleQrisUpload}
                      className="hidden"
                    />

                    <div className="flex justify-center pt-4">
                      <button
                        onClick={saveQris}
                        disabled={savingQris}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition disabled:opacity-50"
                      >
                        {savingQris ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Simpan QRIS
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600" />
                Notifikasi
              </h2>

              <div className="space-y-4">
                {[
                  { label: 'Email notifikasi donasi baru', enabled: true },
                  { label: 'Email laporan mingguan', enabled: true },
                  { label: 'Notifikasi browser', enabled: false },
                  { label: 'WhatsApp notifikasi', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <button className={`w-12 h-6 rounded-full transition ${item.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Keamanan
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Ubah Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition">
                    <Save className="w-5 h-5" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
