'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyComparisonChartProps {
  month: number;
  year: number;
}

export default function MonthlyComparisonChart({ month, year }: MonthlyComparisonChartProps) {
  // Mock data - akan diganti dengan API call
  const data = [
    {
      month: 'Jul',
      pemasukan: 105000000,
      pengeluaran: 72000000,
    },
    {
      month: 'Agu',
      pemasukan: 108500000,
      pengeluaran: 75500000,
    },
    {
      month: 'Sep',
      pemasukan: 112800000,
      pengeluaran: 79500000,
    },
    {
      month: 'Okt',
      pemasukan: 118200000,
      pengeluaran: 82100000,
    },
    {
      month: 'Nov',
      pemasukan: 125500000,
      pengeluaran: 87300000,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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
