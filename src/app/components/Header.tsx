import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
  return (
    <header className="flex items-center justify-between gap-4 bg-red-700 p-2 text-white">
      <Image
        src="/logoHopeful.png"
        alt="Hopeful Icon"
        width={100}
        height={100}
      />

      <Link href="/" className="cursor-pointer hover:underline">
        Home
      </Link>
      <Link href="/usuarios" className="cursor-pointer hover:underline">
        Usuários
      </Link>
      <Link href="/pesquisa" className="cursor-pointer hover:underline">
        Pesquisa
      </Link>
      <Link href="/cenario/criar" className="cursor-pointer hover:underline">
        Criar cenário
      </Link>
      <button className="cursor-pointer hover:underline">Deslogar</button>
    </header>
  );
}

export default Header;
