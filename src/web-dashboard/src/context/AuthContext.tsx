"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/api';

// Auxiliar para manipular cookies no lado do cliente
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface User {
  username: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Recupera a sessão dos cookies
    const savedToken = getCookie('pulse_token');
    const savedUser = getCookie('pulse_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Se o JSON estiver corrompido, limpa tudo
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Proteção de Rotas baseada em Cookies
  useEffect(() => {
    if (!loading) {
      const isPublicPage = pathname === '/login' || pathname === '/';
      
      if (!token && !isPublicPage) {
        router.push('/login');
      } else if (token && isPublicPage) {
        // Redireciona usuários logados para suas áreas específicas
        const targetPath = user?.role === 'admin' ? '/admin' : '/user';
        router.push(targetPath);
      }
    }
  }, [token, pathname, loading, router, user]);

  const login = async (credentials: any) => {
    try {
      const data = await authService.login(credentials.username, credentials.password);
      
      const userData = { 
        username: credentials.username.split('@')[0], 
        email: credentials.username,
        role: credentials.username.includes('admin') ? 'admin' : 'user' 
      };
      
      // Salva no estado e nos Cookies
      setToken(data.access_token);
      setUser(userData);
      
      setCookie('pulse_token', data.access_token);
      setCookie('pulse_user', JSON.stringify(userData));

      // Redirecionamento imediato após login
      router.push(userData.role === 'admin' ? '/admin' : '/user');
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    deleteCookie('pulse_token');
    deleteCookie('pulse_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
