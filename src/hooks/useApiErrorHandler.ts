'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

/**
 * Hook global para interceptar erros de autenticação
 * Monitora eventos de erro JWT inválido e redireciona automaticamente
 */
export const useApiErrorHandler = () => {
  const router = useRouter();

  useEffect(() => {
    // Handler para erros de fetch não capturados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;

      // Verifica se é um erro de API com status 401
      if (error?.status === 401) {
        event.preventDefault();

        // Limpa autenticação
        Cookies.remove('token');
        Cookies.remove('user');

        // Redireciona para login se não estiver lá
        if (!window.location.pathname.includes('/login')) {
          router.push('/login');
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );
    };
  }, [router]);
};
