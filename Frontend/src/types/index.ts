// Transaction Types
export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  donor?: string;
  recipient?: string;
  date: string;
  receiptNumber?: string;
  notes?: string;
  category: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Program Types
export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  qris?: string; // QRIS image URL for this program
  target: number;
  collected: number;
  progress: number;
  daysLeft?: number;
  donors: number;
  isActive: boolean;
  isFeatured: boolean;
  startDate: string;
  endDate?: string;
}

// News Types
export interface News {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image?: string;
  category: 'LAPORAN' | 'KEGIATAN' | 'PENGUMUMAN' | 'ARTIKEL';
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  transactionCount?: number;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  donorCount: number;
  incomeChange: number;
  expenseChange: number;
  period: {
    month: number;
    year: number;
    label: string;
  };
}

// Report Stats Types
export interface ReportStats {
  period: {
    month: number;
    year: number;
    label: string;
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  incomeByCategory: CategoryStat[];
  expenseByCategory: CategoryStat[];
  monthlyComparison: MonthlyData[];
}

export interface CategoryStat {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  amount: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expense: number;
}

// User Types (re-export from auth)
export type { User } from '@/lib/auth';
