'use client';

import { LogOut, LogIn, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHeaderAuth } from '@/hooks/useHeaderAuth';
import { useState } from 'react';
import { HamburgerIcon } from './HamburgerIcon';
import { SideMenu } from './SideMenu';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export default function Header() {
  const router = useRouter();
  const { shouldRenderHeader, links, logout, role, isAuthenticated } =
    useHeaderAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!shouldRenderHeader) return null;

  return (
    <>
      <header className="fixed top-0 left-0 z-20 flex w-full items-center justify-between bg-black px-4 py-2 text-gray-300">
        <div className="flex items-center gap-2">
          <HamburgerIcon onClick={() => setIsMenuOpen(true)} />
          <Link href="https://www.hopeful.pro/">
            <Image
              src="/logoHopeful.png"
              alt="Hopeful Icon"
              width={32}
              height={32}
              className="rounded"
            />
          </Link>
        </div>

        <div className="mr-auto ml-14 hidden items-center gap-6 text-base font-medium md:flex">
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

        <div className="flex items-center gap-4">
          {(role === Role.ADMIN || role === Role.USER) && (
            <Link
              href={role === Role.ADMIN ? '/admin/create-scenario' : '/user'}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-900 focus-visible:ring-0 focus-visible:outline-none active:bg-blue-800"
            >
              <Plus className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">Criar Cenário</span>
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-800"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-800"
              title="Entrar"
            >
              <LogIn className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={links}
        role={role as Role}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        onLogin={() => router.push('/login')}
      />
    </>
  );
}
