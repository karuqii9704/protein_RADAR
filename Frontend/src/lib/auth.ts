import { api } from './api';

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';
  avatar?: string;
}

// Auth response type
interface AuthResponse {
  token: string;
  user: User;
}

// Login function
export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await api.post<{ success: boolean; data: AuthResponse; message?: string }>('/api/auth/login', {
      email,
      password,
    });

    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    }
    
    return { success: false, error: 'Login failed' };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return { 
      success: false, 
      error: axiosError.response?.data?.error || 'Login failed' 
    };
  }
}

// Logout function
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/admin/login';
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

// Get token from localStorage
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Check if user has required role
export function hasRole(requiredRoles: User['role'][]): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

// Verify token with backend
export async function verifyAuth(): Promise<User | null> {
  try {
    const response = await api.get<{ success: boolean; data: User }>('/api/auth/me');
    if (response.data.success && response.data.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    return null;
  } catch {
    // Clear invalid auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}
