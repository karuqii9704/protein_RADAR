'use client';

import { useEffect, useState } from 'react';
import { 
  History, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogIn,
  CheckCircle,
  XCircle,
  X,
  Globe,
  Clock,
  User,
  Info
} from 'lucide-react';
import { apiGet } from '@/lib/api';

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  entityTitle: string | null;
  userDisplay: string;
  timestamp: string;
  ipAddress: string | null;
  details: string | null;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterEntity, setFilterEntity] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { 
        page: currentPage, 
        limit: 20 
      };
      if (filterEntity) params.entity = filterEntity;
      if (filterAction) params.action = filterAction;

      const res = await apiGet<ActivityLog[]>('/api/admin/activity-logs', params);
      if (res.success && res.data) {
        setLogs(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filterEntity, filterAction]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="w-4 h-4 text-green-600" />;
      case 'UPDATE': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'DELETE': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'LOGIN': return <LogIn className="w-4 h-4 text-purple-600" />;
      case 'APPROVE': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECT': return <XCircle className="w-4 h-4 text-orange-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-700';
      case 'UPDATE': return 'bg-blue-100 text-blue-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      case 'LOGIN': return 'bg-purple-100 text-purple-700';
      case 'APPROVE': return 'bg-emerald-100 text-emerald-700';
      case 'REJECT': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE': return '+ Buat';
      case 'UPDATE': return 'Edit';
      case 'DELETE': return 'Hapus';
      case 'LOGIN': return 'Login';
      case 'APPROVE': return 'Terima';
      case 'REJECT': return 'Tolak';
      default: return action;
    }
  };

  const getEntityLabel = (entity: string) => {
    const labels: Record<string, string> = {
      'Program': 'Program',
      'News': 'Berita',
      'Transaction': 'Transaksi',
      'Slide': 'Slide',
      'Donation': 'Donasi',
      'User': 'Pengguna',
      'Setting': 'Pengaturan',
      'Auth': 'Login',
    };
    return labels[entity] || entity;
  };

  const parseDetails = (details: string | null) => {
    if (!details) return null;
    try {
      return JSON.parse(details);
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-500 mt-1">Catatan semua perubahan data oleh admin</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Info:</strong> Log aktivitas bersifat <strong>read-only</strong> dan tidak dapat diubah untuk keperluan audit dan transparansi.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter:</span>
          </div>
          
          <select
            value={filterEntity}
            onChange={(e) => { setFilterEntity(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Entitas</option>
            <option value="Auth">Login</option>
            <option value="Program">Program</option>
            <option value="News">Berita</option>
            <option value="Transaction">Transaksi</option>
            <option value="Slide">Slide</option>
            <option value="Donation">Donasi</option>
            <option value="User">Pengguna</option>
          </select>

          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Aksi</option>
            <option value="LOGIN">Login</option>
            <option value="CREATE">Buat</option>
            <option value="UPDATE">Edit</option>
            <option value="DELETE">Hapus</option>
            <option value="APPROVE">Terima</option>
            <option value="REJECT">Tolak</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Waktu</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Admin</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Entitas</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono text-gray-600">{log.timestamp}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{log.userDisplay}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{getEntityLabel(log.entity)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 truncate max-w-xs">
                          {log.entityTitle || log.entityId || '-'}
                        </span>
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                          onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada log aktivitas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedLog(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detail Log Aktivitas</h2>
                <p className="text-gray-500 text-sm mt-1">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Timestamp */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waktu</p>
                  <p className="font-medium text-gray-900">{selectedLog.timestamp}</p>
                </div>
              </div>

              {/* User */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Admin</p>
                  <p className="font-medium text-gray-900">{selectedLog.userDisplay}</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getActionIcon(selectedLog.action)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aksi</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                    {getActionLabel(selectedLog.action)}
                  </span>
                </div>
              </div>

              {/* Entity */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Info className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entitas</p>
                  <p className="font-medium text-gray-900">{getEntityLabel(selectedLog.entity)}</p>
                  {selectedLog.entityTitle && (
                    <p className="text-sm text-gray-600 mt-1">{selectedLog.entityTitle}</p>
                  )}
                </div>
              </div>

              {/* IP Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">IP Address</p>
                  <p className="font-medium font-mono text-gray-900">
                    {selectedLog.ipAddress || 'Tidak tersedia'}
                  </p>
                </div>
              </div>

              {/* Details JSON */}
              {selectedLog.details && parseDetails(selectedLog.details) && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Informasi Tambahan</p>
                  <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-40 font-mono">
                    {JSON.stringify(parseDetails(selectedLog.details), null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
