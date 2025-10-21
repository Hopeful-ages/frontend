'use client';

import { LogOut, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { useHeaderAuth } from '@/hooks/useHeaderAuth';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export default function Header() {
  const router = useRouter();
  const { shouldRenderHeader, links, logout, role, isAuthenticated } =
    useHeaderAuth();

  if (!shouldRenderHeader) return null;

  return (
    <header className="fixed top-0 left-0 z-100 flex w-full items-center justify-between bg-black px-6 py-2 text-gray-300">
      <div className="flex items-center gap-2">
        <Link href="https://www.hopeful.pro/">
          <Image
            src="/logoHopeful.png"
            alt="Hopeful Icon"
            width={40}
            height={40}
            className="rounded"
          />
        </Link>
      </div>

      <div className="mr-auto ml-14 hidden items-center gap-8 text-lg font-medium md:flex">
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

      <div className="flex items-center gap-6">
        {(role === Role.ADMIN || role === Role.USER) && (
          <Button variant="primary" size="sm" className="h-0.5 w-52 p-0.5">
            <Link
              href={role === Role.ADMIN ? '/admin/create-scenario' : '/user'}
            >
              Criar Cenário
            </Link>
          </Button>
        )}

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="inline-flex h-10 w-9 items-center justify-center rounded-md hover:bg-gray-800"
            title="Sair"
          >
            <LogOut className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="inline-flex h-10 w-9 items-center justify-center rounded-md hover:bg-gray-800"
            title="Entrar"
          >
            <LogIn className="h-6 w-6" />
          </button>
        )}
      </div>
    </header>
  );
}
