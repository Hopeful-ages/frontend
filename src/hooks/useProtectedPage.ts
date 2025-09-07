import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { JWTPayload } from '@/lib/jwt';

interface UseProtectedPageOptions {
  requiredRole?: 'ROLE_ADMIN' | 'ROLE_USER';
  redirectTo?: string;
}

export const useProtectedPage = (options: UseProtectedPageOptions = {}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<JWTPayload | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const token = Cookies.get('token');
      const user = Cookies.get('user');

      if (!token || !user) {
        router.push('/login');
        return;
      }

      try {
        const userData = JSON.parse(user) as JWTPayload;

        const currentTime = Math.floor(Date.now() / 1000);
        if (!userData.exp || userData.exp < currentTime) {
          Cookies.remove('token');
          Cookies.remove('user');
          router.push('/login');
          return;
        }

        if (options.requiredRole) {
          if (
            options.requiredRole === 'ROLE_ADMIN' &&
            !userData.roles.includes('ROLE_ADMIN')
          ) {
            router.push(options.redirectTo || '/user');
            return;
          }

          if (
            options.requiredRole === 'ROLE_USER' &&
            !userData.roles.includes('ROLE_USER') &&
            !userData.roles.includes('ROLE_ADMIN')
          ) {
            router.push(options.redirectTo || '/login');
            return;
          }
        }

        setUserInfo(userData);
        setHasAccess(true);
      } catch {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router, options.requiredRole, options.redirectTo]);

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  return { isLoading, userInfo, hasAccess, logout };
};
