'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Calendar,
  FileText
} from 'lucide-react';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
  amount: number;
  date: string;
}

export default function CreateLaporanPage() {
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    description: '',
    status: 'draft'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'income', description: '', category: '', amount: 0, date: '' }
  ]);

  const incomeCategories = ['Infaq', 'Zakat', 'Sedekah', 'Wakaf', 'Donasi', 'Lainnya'];
  const expenseCategories = ['Operasional', 'Listrik', 'Air', 'Kebersihan', 'Renovasi', 'Gaji', 'Lainnya'];

  const addTransaction = (type: 'income' | 'expense') => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      description: '',
      category: '',
      amount: 0,
      date: ''
    };
    setTransactions([...transactions, newTransaction]);
  };

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateTransaction = (id: number, field: keyof Transaction, value: string | number) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/laporan"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Laporan Baru</h1>
            <p className="text-gray-500 mt-1">Buat laporan keuangan bulanan baru</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/laporan"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
            Batal
          </Link>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition">
            <Save className="w-5 h-5" />
            Simpan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Informasi Dasar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Laporan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="contoh: Laporan Keuangan November 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Periode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="month"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi / Catatan
                </label>
                <textarea
                  rows={3}
                  placeholder="Tambahkan catatan atau deskripsi untuk laporan ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Daftar Transaksi</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => addTransaction('income')}
                  className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                >
                  <Plus className="w-4 h-4" />
                  Pemasukan
                </button>
                <button
                  onClick={() => addTransaction('expense')}
                  className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                >
                  <Plus className="w-4 h-4" />
                  Pengeluaran
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`p-4 rounded-xl border ${
                    transaction.type === 'income' 
                      ? 'bg-green-50/50 border-green-200' 
                      : 'bg-red-50/50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} #{index + 1}
                    </span>
                    <button
                      onClick={() => removeTransaction(transaction.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Deskripsi"
                      value={transaction.description}
                      onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select
                      value={transaction.category}
                      onChange={(e) => updateTransaction(transaction.id, 'category', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {(transaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Jumlah (Rp)"
                      value={transaction.amount || ''}
                      onChange={(e) => updateTransaction(transaction.id, 'amount', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="date"
                      value={transaction.date}
                      onChange={(e) => updateTransaction(transaction.id, 'date', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              ))}

              {transactions.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Belum ada transaksi</p>
                  <p className="text-sm">Klik tombol di atas untuk menambah transaksi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-600 font-medium mb-1">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-700">
                  Rp {totalIncome.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-sm text-red-600 font-medium mb-1">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-700">
                  Rp {totalExpense.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className={`p-4 rounded-xl ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  <p className={`text-sm font-medium mb-1 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    Saldo Akhir
                  </p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                    Rp {balance.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>Jumlah Transaksi</span>
                  <span className="font-medium text-gray-900">{transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pemasukan</span>
                  <span className="font-medium text-green-600">
                    {transactions.filter(t => t.type === 'income').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pengeluaran</span>
                  <span className="font-medium text-red-600">
                    {transactions.filter(t => t.type === 'expense').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
