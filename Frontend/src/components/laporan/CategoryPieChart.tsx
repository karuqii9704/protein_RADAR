'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryData {
  categoryId: string;
  name: string;
  color: string;
  amount: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  loading: boolean;
  type: 'income' | 'expense';
}

// Default colors for categories
const INCOME_COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669'];
const EXPENSE_COLORS = ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#DC2626'];

export default function CategoryPieChart({ data, loading, type }: CategoryPieChartProps) {
  const defaultColors = type === 'income' ? INCOME_COLORS : EXPENSE_COLORS;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Prepare chart data with colors
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.amount,
    color: item.color || defaultColors[index % defaultColors.length],
    percent: total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: typeof chartData[0] }> }) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-600">{formatCurrency(item.value)}</p>
          <p className="text-xs text-gray-500">{item.payload.percent}% dari total</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => {
    return (
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
              <span className="text-gray-500 text-xs w-12 text-right">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0 || total === 0) {
    return (
      <div className="h-[250px] flex flex-col items-center justify-center text-gray-400">
        <PieChartIcon className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-sm">Belum ada data {type === 'income' ? 'pemasukan' : 'pengeluaran'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Total */}
      <div className="text-center mb-4 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">Total {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</p>
        <p className={`text-2xl font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(total)}
        </p>
      </div>

      {/* Legend */}
      {renderLegend()}
    </div>
  );
}
