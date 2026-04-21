export type UserRole = 'SUPER_ADMIN' | 'ORGANIZATION' | 'HR' | 'ADMIN' | 'TUTOR' | 'STUDENT';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
