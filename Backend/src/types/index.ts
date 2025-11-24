// Global type definitions for the application

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface DateRangeFilter {
  startDate?: Date | string;
  endDate?: Date | string;
}

export type UserRole = 'super_admin' | 'admin' | 'viewer';

export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'transfer' | 'qris' | 'other';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ArticleStatus = 'draft' | 'published' | 'archived';
