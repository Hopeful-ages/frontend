'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useLoading } from '@/providers/LoadingProvider';
import { useToast } from '@/hooks/useToast';
import { Role } from '@/components/Header';
const ADMIN_LINKS = [
  { href: '/admin/users', label: 'Usuários' },
  { href: '/admin/plans', label: 'Planos' },
  { href: '/pesquisa', label: 'Pesquisa' },
];

const USER_LINKS = [{ href: '/', label: 'Pesquisa' }];

const GUEST_LINKS = [{ href: '/', label: 'Pesquisa' }];

export function useHeaderAuth() {
  const router = useRouter();
  const { isCheckingAuth, isAuthenticated, role, logout } = useAuthRedirect();
  const { showLoading, hideLoading } = useLoading();
  const { error } = useToast();
  const successShown = useRef(false);

  useEffect(() => {
    if (!isCheckingAuth) hideLoading();
  }, [isCheckingAuth, hideLoading]);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (isAuthenticated && role && !successShown.current) {
      successShown.current = true;
    }
  }, [isCheckingAuth, isAuthenticated, role]);

  // Seleciona links baseado na role
  const links =
    role === Role.ADMIN
      ? ADMIN_LINKS
      : role === Role.USER
        ? USER_LINKS
        : GUEST_LINKS; // caso não tenha role

  return {
    shouldRenderHeader: !isCheckingAuth,
    links,
    logout,
    role: role ?? 'guest', // role guest se não estiver logado
    isAuthenticated,
  };
}
