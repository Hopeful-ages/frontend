import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from './Button';

function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border border-gray-700 bg-black px-6 py-2 text-gray-300">
      <div className="mr-1 ml-1">
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

      <div className="mr-auto ml-14 flex items-center gap-8 text-sm">
        <Link
          href="/"
          className="cursor-pointer hover:text-white hover:underline"
        >
          Home
        </Link>
        <Link
          href="/usuarios"
          className="cursor-pointer hover:text-white hover:underline"
        >
          Usuários
        </Link>
        <Link
          href="/pesquisa"
          className="cursor-pointer hover:text-white hover:underline"
        >
          Pesquisa
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Button variant={'primary'} size={'sm'} className="h-0.5 w-52 p-0.5">
          <Link href="/criar-cenario">Criar Cenário</Link>
        </Button>
        <Link
          href="http://localhost:3000/"
          className="inline-flex h-10 w-9 items-center justify-center rounded-md hover:bg-gray-800"
        >
          <LogOut className="h-12 w-12" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
