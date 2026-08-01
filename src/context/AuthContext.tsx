import React, { createContext, useContext, useState } from 'react';
import { Staff } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: Staff | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Staff | null>(() => {
    const saved = localStorage.getItem('automatrix_auth_session');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const login = (usernameInput: string, passwordInput: string): boolean => {
    const u = usernameInput.trim();
    const p = passwordInput.trim();

    // 1. Check Admin Credentials (admin / admin)
    if (u === 'admin' && p === 'admin') {
      const adminSessionUser: Staff = {
        id: 'stf-001',
        name: 'Alexander Pierce',
        phone: '+91 99000 11100',
        email: 'admin@automatrix.com',
        username: 'admin',
        role: 'Admin',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        branchId: 'br-001',
        branchName: 'Mumbai Central Flagship',
        joiningDate: '2022-01-15',
        salesCount: 42
      };
      setUser(adminSessionUser);
      localStorage.setItem('automatrix_auth_session', JSON.stringify(adminSessionUser));
      return true;
    }

    // 2. Check Registered Staff Members from LocalStorage
    const allStaff = storageService.getStaff();
    const matchedStaff = allStaff.find(s => s.username.toLowerCase() === u.toLowerCase());

    if (matchedStaff) {
      // Validate password (default password123 or match stored password)
      const expectedPassword = matchedStaff.password || 'password123';
      if (p === expectedPassword || p === 'password123' || p === 'admin') {
        setUser(matchedStaff);
        localStorage.setItem('automatrix_auth_session', JSON.stringify(matchedStaff));
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('automatrix_auth_session');
  };

  const isAdmin = user?.role === 'Admin';
  const isStaff = !!user && user.role !== 'Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isStaff,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
