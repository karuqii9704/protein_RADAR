'use client';

import Link from 'next/link';
import { 
  Droplets, 
  Building2, 
  Hospital, 
  Heart,
  BookOpen,
  DollarSign,
  MoreHorizontal
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Infak Air',
    icon: <Droplets className="w-8 h-8" />,
    href: '/programs/infak-air',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: 'Renovasi Masjid',
    icon: <Building2 className="w-8 h-8" />,
    href: '/programs/renovasi-masjid',
    color: 'from-amber-600 to-amber-700',
  },
  {
    id: 3,
    name: 'Santunan Yatim',
    icon: <Heart className="w-8 h-8" />,
    href: '/programs/santunan-yatim',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 4,
    name: 'Palestina',
    icon: <Hospital className="w-8 h-8" />,
    href: '/programs/palestina',
    color: 'from-green-600 to-green-700',
  },
  {
    id: 5,
    name: 'Infak Quran',
    icon: <BookOpen className="w-8 h-8" />,
    href: '/programs/infak-quran',
    color: 'from-emerald-600 to-emerald-700',
  },
  {
    id: 6,
    name: 'Wakaf Uang',
    icon: <DollarSign className="w-8 h-8" />,
    href: '/programs/wakaf-uang',
    color: 'from-yellow-600 to-yellow-700',
  },
  {
    id: 7,
    name: 'Lainnya',
    icon: <MoreHorizontal className="w-8 h-8" />,
    href: '/programs',
    color: 'from-gray-600 to-gray-700',
  },
];

export default function ProgramCategories() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Program Prioritas
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group flex flex-col items-center"
          >
            <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white mb-3 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
              {category.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center group-hover:text-green-600 transition">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
