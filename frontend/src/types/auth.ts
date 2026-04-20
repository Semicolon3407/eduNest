export type UserRole = 'SUPER_ADMIN' | 'ORGANIZATION' | 'HR' | 'ADMIN' | 'TUTOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
