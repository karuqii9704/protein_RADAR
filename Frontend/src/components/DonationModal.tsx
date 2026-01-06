'use client';

import { useState, useRef } from 'react';
import { X, Upload, Loader2, CheckCircle, Image as ImageIcon, FileText } from 'lucide-react';
import { apiPost } from '@/lib/api';
import { formatInputNumber, parseInputNumber } from '@/lib/currency';
import toast from 'react-hot-toast';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId: string;
  programTitle: string;
  programQris?: string | null; // QRIS image URL for this program
}

export default function DonationModal({ isOpen, onClose, programId, programTitle, programQris }: DonationModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
    isAnonymous: false,
  });
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle amount input with thousand separator formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatInputNumber(rawValue);
    setFormData(prev => ({
      ...prev,
      amount: formatted,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      
      // Check if PDF
      const isPdfFile = file.type === 'application/pdf';
      setIsPdf(isPdfFile);
      setPaymentProofFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - parse formatted amount back to number
    const amount = parseInputNumber(formData.amount);
    if (!amount || amount <= 0) {
      toast.error('Nominal donasi wajib diisi');
      return;
    }
    if (amount < 1000) {
      toast.error('Nominal donasi minimal Rp 1.000');
      return;
    }
    if (!paymentProof) {
      toast.error('Bukti pembayaran wajib diupload');
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost('/api/donations', {
        programId,
        amount,
        donorName: formData.donorName || undefined,
        donorEmail: formData.donorEmail || undefined,
        donorPhone: formData.donorPhone || undefined,
        message: formData.message || undefined,
        isAnonymous: formData.isAnonymous,
        paymentProof,
      });

      if (res.success) {
        setSuccess(true);
        toast.success('Donasi berhasil disubmit!');
      } else {
        toast.error(res.error || 'Gagal mengirim donasi');
      }
    } catch (error) {
      console.error('Submit donation error:', error);
      toast.error('Gagal mengirim donasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      message: '',
      isAnonymous: false,
    });
    setPaymentProof(null);
    setPaymentProofFile(null);
    setIsPdf(false);
    setSuccess(false);
    onClose();
  };

  // Determine which QRIS to show - program specific or fallback
  const qrisUrl = programQris || '/qris.png';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-600 to-green-500">
          <div>
            <h2 className="text-xl font-bold text-white">Donasi Sekarang</h2>
            <p className="text-green-100 text-sm mt-1">{programTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {success ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Donasi Berhasil Disubmit!
              </h3>
              <p className="text-gray-600 mb-6">
                Terima kasih atas donasi Anda. Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* QRIS Section */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-3">Scan QRIS untuk melakukan pembayaran:</p>
                <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={qrisUrl} 
                    alt="QRIS Payment"
                    className="w-48 h-48 mx-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="1"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M18 18h3v3h-3z"/></svg>';
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Masjid Syamsul &apos;Ulum
                </p>
              </div>

              {/* Amount with thousand separator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nominal Donasi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="amount"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[10000, 25000, 50000, 100000, 250000, 500000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, amount: formatInputNumber(amt.toString()) }))}
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg hover:bg-green-100 transition"
                    >
                      {(amt / 1000).toLocaleString('id-ID')}rb
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">Donasi sebagai Anonim (Hamba Allah)</span>
              </label>

              {/* Donor Info (optional) */}
              {!formData.isAnonymous && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama <span className="text-gray-400">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-gray-400">(opsional)</span>
                      </label>
                      <input
                        type="email"
                        name="donorEmail"
                        value={formData.donorEmail}
                        onChange={handleInputChange}
                        placeholder="email@contoh.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No. HP <span className="text-gray-400">(opsional)</span>
                      </label>
                      <input
                        type="tel"
                        name="donorPhone"
                        value={formData.donorPhone}
                        onChange={handleInputChange}
                        placeholder="08xxx"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan/Doa <span className="text-gray-400">(opsional)</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tulis pesan atau doa Anda..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Payment Proof Upload - Updated to accept PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bukti Pembayaran <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {paymentProof ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    {isPdf ? (
                      // PDF Preview
                      <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-red-500 mb-2" />
                        <p className="text-sm text-gray-600">{paymentProofFile?.name}</p>
                      </div>
                    ) : (
                      // Image Preview
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={paymentProof} 
                          alt="Bukti Pembayaran" 
                          className="w-full h-48 object-contain bg-gray-50"
                        />
                        <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white text-sm rounded-lg">
                          {paymentProofFile?.name}
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentProof(null);
                        setPaymentProofFile(null);
                        setIsPdf(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition group"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100">
                      <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                    </div>
                    <p className="text-gray-600 font-medium group-hover:text-green-700">
                      Klik untuk upload bukti pembayaran
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      JPG, PNG, atau PDF (max 5MB)
                    </p>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-xl hover:from-green-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Kirim Donasi
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Dengan mengirim donasi, Anda menyetujui bahwa data akan digunakan untuk keperluan verifikasi.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
