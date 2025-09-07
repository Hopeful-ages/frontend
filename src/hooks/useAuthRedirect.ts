import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      const user = Cookies.get('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);

          const currentTime = Math.floor(Date.now() / 1000);
          if (userData.exp && userData.exp > currentTime) {
            if (userData.roles.includes('ROLE_ADMIN')) {
              router.push('/admin');
            } else if (userData.roles.includes('ROLE_USER')) {
              router.push('/user');
            }
            setIsAuthenticated(true);
            setIsCheckingAuth(false);
            return;
          } else {
            Cookies.remove('token');
            Cookies.remove('user');
          }
        } catch {
          Cookies.remove('token');
          Cookies.remove('user');
        }
      }

      setIsAuthenticated(false);
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  return { isCheckingAuth, isAuthenticated };
};
