'use client';

import Header, { Role } from '@/components/Header';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/providers/LoadingProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Home() {
  const router = useRouter();
  const { isCheckingAuth, isAuthenticated, role } = useAuthRedirect();
  const { showLoading, hideLoading } = useLoading();
  const { success, error, warning } = useToast();

  const successShown = useRef(false);

  useEffect(() => {
    if (isCheckingAuth) {
      showLoading('Verificando autenticação...');
      warning('Atenção!!', 'Verificando autenticação...');
    } else {
      setTimeout(() => {
        hideLoading();
      }, 1000);
    }
  }, [isCheckingAuth, showLoading, hideLoading]);

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || !role)) {
      showLoading('Redirecionando para login...');
      error('Sessão expirada', 'Por favor, faça login novamente.');
      router.push('/login');
    }

    if (!isCheckingAuth && isAuthenticated && role && !successShown.current) {
      success('Autenticação verificada com sucesso!');
      successShown.current = true;
    }
  }, [isCheckingAuth, isAuthenticated, role, router, showLoading]);

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated || !role) {
    return null;
  }

  return (
    <main>
      <Header role={role as Role} />
    </main>
  );
}
