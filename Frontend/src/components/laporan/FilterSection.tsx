'use client';

import { Calendar, Filter } from 'lucide-react';

interface FilterSectionProps {
  selectedMonth: number;
  selectedYear: number;
  onFilterChange: (month: number, year: number) => void;
}

export default function FilterSection({ selectedMonth, selectedYear, onFilterChange }: FilterSectionProps) {
  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(parseInt(e.target.value), selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(selectedMonth, parseInt(e.target.value));
  };

  const handleReset = () => {
    const now = new Date();
    onFilterChange(now.getMonth() + 1, now.getFullYear());
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-gray-700">Filter Periode:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Month Selector */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer hover:border-green-400 transition"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Year Selector */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer hover:border-green-400 transition"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Reset
        </button>

        {/* Current Selection Display */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-sm text-green-700">
            Menampilkan data: <span className="font-bold">{months.find(m => m.value === selectedMonth)?.label} {selectedYear}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
