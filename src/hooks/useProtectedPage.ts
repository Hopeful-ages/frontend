'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { JWTPayload } from '@/lib/jwt';

type Role = 'ROLE_ADMIN' | 'ROLE_USER';

interface UseProtectedPageOptions {
  requiredRole?: Role;
  redirectTo?: string;
}

// Função helper para limpar autenticação
const clearAuth = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

// Função helper para verificar se o token expirou
const isTokenExpired = (userData: JWTPayload): boolean => {
  const now = Math.floor(Date.now() / 1000);
  return !userData.exp || userData.exp < now;
};

export const useProtectedPage = (options: UseProtectedPageOptions = {}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<JWTPayload | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');

    // Se não tiver token ou user, redireciona para login
    if (!token || !user) {
      clearAuth();
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(user) as JWTPayload;

      // Verifica se o token expirou
      if (isTokenExpired(userData)) {
        clearAuth();
        router.push('/login');
        return;
      }

      const roles = userData.roles || [];

      // Verifica permissão baseada na role requerida
      if (options.requiredRole) {
        const isAdmin = roles.includes('ROLE_ADMIN');
        const isUser = roles.includes('ROLE_USER');

        if (options.requiredRole === 'ROLE_ADMIN' && !isAdmin) {
          router.push(options.redirectTo || '/');
          return;
        }

        if (options.requiredRole === 'ROLE_USER' && !isUser && !isAdmin) {
          router.push(options.redirectTo || '/login');
          return;
        }
      }

      setUserInfo(userData);
      setHasAccess(true);
    } catch (error) {
      console.error('Erro ao validar autenticação:', error);
      clearAuth();
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router, options.requiredRole, options.redirectTo]);

  const logout = () => {
    clearAuth();
    router.push('/');
  };

  return { isLoading, hasAccess, userInfo, logout };
};
