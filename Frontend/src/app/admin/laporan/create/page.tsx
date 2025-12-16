'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import type { Category } from '@/types';
import toast from 'react-hot-toast';

interface TransactionItem {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  categoryId: string;
  amount: number;
  date: string;
  donor?: string;
  recipient?: string;
}

export default function CreateLaporanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    { id: Date.now(), type: 'INCOME', description: '', categoryId: '', amount: 0, date: '', donor: '' }
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiGet<Category[]>('/api/admin/categories');
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const incomeCategories = categories.filter(c => c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  const addTransaction = (type: 'INCOME' | 'EXPENSE') => {
    const newTransaction: TransactionItem = {
      id: Date.now(),
      type,
      description: '',
      categoryId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      donor: type === 'INCOME' ? '' : undefined,
      recipient: type === 'EXPENSE' ? '' : undefined,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const removeTransaction = (id: number) => {
    if (transactions.length === 1) {
      toast.error('Minimal harus ada 1 transaksi');
      return;
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateTransaction = (id: number, field: keyof TransactionItem, value: string | number) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  const handleSubmit = async () => {
    // Validate
    const invalidTransactions = transactions.filter(t => !t.description || !t.categoryId || !t.amount);
    if (invalidTransactions.length > 0) {
      toast.error('Lengkapi semua field transaksi');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit each transaction
      const results = await Promise.all(
        transactions.map(t => 
          apiPost('/api/admin/transactions', {
            type: t.type,
            amount: Number(t.amount),
            description: t.description,
            categoryId: t.categoryId,
            date: t.date || new Date().toISOString(),
            donor: t.donor,
            recipient: t.recipient,
          })
        )
      );

      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        toast.error(`${failed.length} transaksi gagal disimpan`);
      } else {
        toast.success(`${transactions.length} transaksi berhasil disimpan`);
        router.push('/admin/laporan');
      }
    } catch (error) {
      toast.error('Gagal menyimpan transaksi');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Tambah Transaksi Baru</h1>
            <p className="text-gray-500 mt-1">Tambahkan transaksi pemasukan atau pengeluaran</p>
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
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-green-700">Total Pemasukan</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Rp {totalIncome.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-red-700">Total Pengeluaran</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Rp {totalExpense.toLocaleString('id-ID')}</p>
        </div>
        <div className={`rounded-xl p-5 border ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className={`font-medium ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo</span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            Rp {balance.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Add Transaction Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => addTransaction('INCOME')}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition"
        >
          <Plus className="w-5 h-5" />
          Tambah Pemasukan
        </button>
        <button
          onClick={() => addTransaction('EXPENSE')}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition"
        >
          <Plus className="w-5 h-5" />
          Tambah Pengeluaran
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div 
            key={transaction.id}
            className={`bg-white rounded-xl p-6 border-2 shadow-sm ${
              transaction.type === 'INCOME' ? 'border-green-200' : 'border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'INCOME' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'INCOME' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {transaction.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'} #{index + 1}
                </span>
              </div>
              <button
                onClick={() => removeTransaction(transaction.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Infaq Jumat"
                  value={transaction.description}
                  onChange={(e) => updateTransaction(transaction.id, 'description', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {transaction.type === 'INCOME' ? 'Donatur' : 'Penerima'}
                </label>
                <input
                  type="text"
                  placeholder={transaction.type === 'INCOME' ? 'Nama donatur' : 'Nama penerima'}
                  value={transaction.type === 'INCOME' ? transaction.donor || '' : transaction.recipient || ''}
                  onChange={(e) => updateTransaction(
                    transaction.id, 
                    transaction.type === 'INCOME' ? 'donor' : 'recipient', 
                    e.target.value
                  )}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={transaction.categoryId}
                  onChange={(e) => updateTransaction(transaction.id, 'categoryId', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih Kategori</option>
                  {(transaction.type === 'INCOME' ? incomeCategories : expenseCategories).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={transaction.amount || ''}
                  onChange={(e) => updateTransaction(transaction.id, 'amount', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={transaction.date}
                  onChange={(e) => updateTransaction(transaction.id, 'date', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
