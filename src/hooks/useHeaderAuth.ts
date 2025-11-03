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
  { href: '/admin/services', label: 'Serviços' },
];

const USER_LINKS = [{ href: '/', label: 'Planos de Contingência' }];

const GUEST_LINKS = [{ href: '/', label: 'Planos de Contingência' }];

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

  const links =
    role === Role.ADMIN
      ? ADMIN_LINKS
      : role === Role.USER
        ? USER_LINKS
        : GUEST_LINKS;

  return {
    shouldRenderHeader: !isCheckingAuth,
    links,
    logout,
    role: role ?? 'guest',
    isAuthenticated,
  };
}
