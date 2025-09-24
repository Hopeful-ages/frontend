'use client';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/providers/LoadingProvider';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button } from './Button';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

const ADMIN_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/admin/users', label: 'Usuários' },
  { href: '/pesquisa', label: 'Pesquisa' },
];

const USER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pesquisa', label: 'Pesquisa' },
];

export default function Header() {
  const router = useRouter();
  const { isCheckingAuth, isAuthenticated, role, logout } = useAuthRedirect();
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
  }, [isCheckingAuth, showLoading, hideLoading, warning]);

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
  }, [
    isCheckingAuth,
    isAuthenticated,
    role,
    router,
    showLoading,
    error,
    success,
  ]);

  if (isCheckingAuth) {
    return null;
  }

  const links = role === Role.ADMIN ? ADMIN_LINKS : USER_LINKS;

  return (
    <header className="fixed top-0 left-0 z-100 flex w-full items-center justify-between bg-black px-6 py-2 text-gray-300">
      <div className="flex items-center gap-2 md:hidden">
        <Link href="https://www.hopeful.pro/">
          <Image
            src="/logoHopeful.png"
            alt="Hopeful Icon"
            width={32}
            height={32}
            className="rounded"
          />
        </Link>
        <span className="text-base font-semibold text-white">Hopeful</span>
      </div>

      <div className="mr-1 ml-1 hidden md:block">
        <Link
          className="ml- inline-flex cursor-pointer items-center hover:underline"
          href="https://www.hopeful.pro/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logoHopeful.png"
            alt="Hopeful Icon"
            width={100}
            height={100}
            className="h-12 w-12"
          />
        </Link>
      </div>

      <div className="text-md mr-auto ml-14 hidden items-center gap-8 font-medium md:flex">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="cursor-pointer hover:text-white hover:underline"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="hidden items-center gap-6 md:flex">
        {role === Role.ADMIN ? (
          <>
            <Button
              variant={'primary'}
              size={'sm'}
              className="h-0.5 w-52 p-0.5"
            >
              <Link href="/criar-cenario">Criar Cenário</Link>
            </Button>
            <button
              onClick={logout}
              className="inline-flex h-10 w-9 items-center justify-center rounded-md hover:bg-gray-800"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            className="inline-flex h-10 w-9 items-center justify-center rounded-md hover:bg-gray-800"
          >
            <LogOut className="h-6 w-6" />
          </button>
        )}
      </div>
    </header>
  );
}
