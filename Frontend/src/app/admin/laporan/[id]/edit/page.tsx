'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import type { Category } from '@/types';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number;
  date: string;
  donor?: string;
  recipient?: string;
  category: { id: string; name: string };
}

export default function EditTransactionPage() {
  const params = useParams();
  const transactionId = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    description: '',
    categoryId: '',
    amount: 0,
    date: '',
    donor: '',
    recipient: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!transactionId) return;
      
      try {
        // Fetch categories
        const catRes = await apiGet<Category[]>('/api/admin/categories');
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        // Fetch transaction
        const txRes = await apiGet<Transaction>(`/api/admin/transactions/${transactionId}`);
        if (txRes.success && txRes.data) {
          const tx = txRes.data;
          setFormData({
            type: tx.type,
            description: tx.description,
            categoryId: tx.category?.id || '',
            amount: tx.amount,
            date: tx.date ? tx.date.split('T')[0] : '',
            donor: tx.donor || '',
            recipient: tx.recipient || '',
          });
        } else {
          toast.error('Transaksi tidak ditemukan');
          router.push('/admin/laporan');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Gagal memuat data');
        router.push('/admin/laporan');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [transactionId, router]);

  const incomeCategories = categories.filter(c => c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  const handleSubmit = async () => {
    if (!formData.description || !formData.categoryId || !formData.amount) {
      toast.error('Lengkapi semua field yang wajib');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiPut(`/api/admin/transactions/${transactionId}`, {
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description,
        categoryId: formData.categoryId,
        date: formData.date || new Date().toISOString(),
        donor: formData.donor || undefined,
        recipient: formData.recipient || undefined,
      });

      if (res.success) {
        toast.success('Transaksi berhasil diperbarui');
        router.push('/admin/laporan');
      } else {
        toast.error(res.error || 'Gagal memperbarui transaksi');
      }
    } catch (error) {
      toast.error('Gagal memperbarui transaksi');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Transaksi</h1>
            <p className="text-gray-500 mt-1">Perbarui data transaksi</p>
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

      {/* Form */}
      <div 
        className={`bg-white rounded-xl p-6 border-2 shadow-sm ${
          formData.type === 'INCOME' ? 'border-green-200' : 'border-red-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            formData.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {formData.type === 'INCOME' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <span className={`font-semibold ${
            formData.type === 'INCOME' ? 'text-green-700' : 'text-red-700'
          }`}>
            {formData.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Infaq Jumat"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.type === 'INCOME' ? 'Donatur' : 'Penerima'}
            </label>
            <input
              type="text"
              placeholder={formData.type === 'INCOME' ? 'Nama donatur' : 'Nama penerima'}
              value={formData.type === 'INCOME' ? formData.donor : formData.recipient}
              onChange={(e) => setFormData({
                ...formData, 
                [formData.type === 'INCOME' ? 'donor' : 'recipient']: e.target.value
              })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Pilih Kategori</option>
              {(formData.type === 'INCOME' ? incomeCategories : expenseCategories).map((cat) => (
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
              value={formData.amount || ''}
              onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
