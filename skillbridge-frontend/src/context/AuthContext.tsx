import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginPayload, RegisterPayload } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skillbridge_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('skillbridge_token');
      if (storedToken) {
        try {
          const me = await authService.getMe();
          setUser(me);
          localStorage.setItem('skillbridge_user', JSON.stringify(me));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    setToken(res.token);
    localStorage.setItem('skillbridge_token', res.token);
    
    // Fetch detailed profile immediately
    const me = await authService.getMe();
    setUser(me);
    localStorage.setItem('skillbridge_user', JSON.stringify(me));
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload);
    setToken(res.token);
    localStorage.setItem('skillbridge_token', res.token);

    const me = await authService.getMe();
    setUser(me);
    localStorage.setItem('skillbridge_user', JSON.stringify(me));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
