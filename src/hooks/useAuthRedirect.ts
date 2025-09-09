'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      const user = Cookies.get('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);

          const currentTime = Math.floor(Date.now() / 1000);
          if (userData.exp && userData.exp > currentTime) {
            setIsAuthenticated(true);

            if (userData.roles?.includes('ROLE_ADMIN')) {
              setRole('admin');
            } else if (userData.roles?.includes('ROLE_USER')) {
              setRole('user');
            }
          } else {
            Cookies.remove('token');
            Cookies.remove('user');
            setIsAuthenticated(false);
            setRole(null);
          }
        } catch {
          Cookies.remove('token');
          Cookies.remove('user');
          setIsAuthenticated(false);
          setRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  return { isCheckingAuth, isAuthenticated, role, logout };
};
