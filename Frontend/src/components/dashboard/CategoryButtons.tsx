'use client';

import Link from 'next/link';
import { 
  Settings, 
  Building2, 
  HandHeart, 
  GraduationCap, 
  BookOpen, 
  Target, 
  Star,
  LucideIcon
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

const categories: Category[] = [
  { 
    id: 1, 
    name: 'Operasional', 
    icon: Settings,
    color: 'from-blue-500 to-blue-600',
    href: '/category/operasional' 
  },
  { 
    id: 2, 
    name: 'Renovasi Masjid', 
    icon: Building2,
    color: 'from-amber-500 to-amber-600',
    href: '/category/renovasi' 
  },
  { 
    id: 3, 
    name: 'Santunan', 
    icon: HandHeart,
    color: 'from-green-500 to-green-600',
    href: '/category/santunan' 
  },
  { 
    id: 4, 
    name: 'Pendidikan', 
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600',
    href: '/category/pendidikan' 
  },
  { 
    id: 5, 
    name: 'Infak Quran', 
    icon: BookOpen,
    color: 'from-emerald-500 to-emerald-600',
    href: '/category/infak-quran' 
  },
  { 
    id: 6, 
    name: 'Kegiatan', 
    icon: Target,
    color: 'from-orange-500 to-orange-600',
    href: '/category/kegiatan' 
  },
  { 
    id: 7, 
    name: 'Lainnya', 
    icon: Star,
    color: 'from-pink-500 to-pink-600',
    href: '/category/lainnya' 
  },
];

export default function CategoryButtons() {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Program Prioritas
          </h3>
          
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group flex flex-col items-center gap-3 p-4 min-w-[120px] hover:scale-105 transition-transform"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-green-600 transition">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

