'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { apiGet } from '@/lib/api';

interface MonthlyComparisonChartProps {
  month: number;
  year: number;
}

interface MonthlyData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

export default function MonthlyComparisonChart({ month, year }: MonthlyComparisonChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch from reports API
        const res = await apiGet<{ monthlyData: MonthlyData[] }>('/api/reports/stats', { month, year });
        if (res.success && res.data?.monthlyData && res.data.monthlyData.length > 0) {
          setData(res.data.monthlyData);
        }
      } catch (error) {
        console.error('Failed to fetch monthly data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: MonthlyData }> }) => {
    if (active && payload && payload.length >= 2) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.month}</p>
          <p className="text-sm text-green-600 mb-1">
            Pemasukan: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-sm text-red-600">
            Pengeluaran: <span className="font-bold">{formatCurrency(payload[1].value)}</span>
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm text-blue-600">
              Saldo: <span className="font-bold">{formatCurrency(payload[0].value - payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-400">
        <BarChart2 className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-sm">Belum ada data transaksi</p>
        <p className="text-xs text-gray-400 mt-1">Data akan muncul setelah ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="pemasukan" 
            fill="#16a34a" 
            radius={[8, 8, 0, 0]}
            name="Pemasukan"
          />
          <Bar 
            dataKey="pengeluaran" 
            fill="#dc2626" 
            radius={[8, 8, 0, 0]}
            name="Pengeluaran"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
