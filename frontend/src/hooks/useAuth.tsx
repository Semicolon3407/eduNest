import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  setRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles
const MOCK_USERS: Record<UserRole, User> = {
  SUPER_ADMIN: { id: '1', name: 'Super Admin', email: 'super@edunest.com', role: 'SUPER_ADMIN' },
  ORGANIZATION: { id: '2', name: 'Westfield College', email: 'admin@westfield.edu', role: 'ORGANIZATION', organizationId: 'org1' },
  HR: { id: '3', name: 'Sarah Wilson', email: 'hr@westfield.edu', role: 'HR', organizationId: 'org1' },
  ADMINISTRATOR: { id: '4', name: 'John Doe', email: 'office@westfield.edu', role: 'ADMINISTRATOR', organizationId: 'org1' },
  TUTOR: { id: '5', name: 'Prof. Miller', email: 'miller@westfield.edu', role: 'TUTOR', organizationId: 'org1' },
  STUDENT: { id: '6', name: 'Alex Smith', email: 'alex@student.com', role: 'STUDENT', organizationId: 'org1' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedRole = localStorage.getItem('mock_role');
    return savedRole ? MOCK_USERS[savedRole as UserRole] : null;
  });

  const login = (role: UserRole) => {
    setUser(MOCK_USERS[role]);
    localStorage.setItem('mock_role', role);
  };

  const setRole = (role: UserRole) => {
    login(role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_role');
  };

  return (
    <AuthContext.Provider value={{ user, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
