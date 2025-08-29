import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

function Header() {
  return (
    <header className="flex items-center justify-between border border-gray-700 bg-black px-6 py-2 text-gray-300">
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
          className="h-7 w-7"
        />
      </Link>

      <div className="flex items-center gap-10 text-sm">
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

      <div className="flex items-center gap-20">
        <Link href="/cenario/criar" className="cursor-pointer hover:underline">
          Criar cenário
        </Link>
        <Link
          href="http://localhost:3000/"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-500 hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
