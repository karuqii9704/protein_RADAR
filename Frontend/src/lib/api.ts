import axios from 'axios';

// API Base URL from environment
// If NEXT_PUBLIC_API_URL is not set or points to the same domain, use relative URLs
const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If no env URL set, use relative path (same origin)
  if (!envUrl) return '';
  
  // In browser, check if API is on same domain
  if (typeof window !== 'undefined') {
    try {
      const apiDomain = new URL(envUrl).hostname;
      const currentDomain = window.location.hostname;
      // If same domain, use relative path to avoid CORS issues
      if (apiDomain === currentDomain) return '';
    } catch {
      // If URL parsing fails, use the env URL as-is
    }
  }
  
  return envUrl;
};

const API_URL = getApiUrl();

// Create axios instance with defaults
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if on admin page
        if (window.location.pathname.startsWith('/admin') && 
            window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Helper function for API calls
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  const response = await api.post<ApiResponse<T>>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  const response = await api.put<ApiResponse<T>>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  const response = await api.delete<ApiResponse<T>>(url);
  return response.data;
}

export default api;
