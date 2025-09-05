'use client';

import Header, { Role } from '@/components/Header';
import { Dropdown } from '@/components/Dropdown';
import { Modal } from '@/components/Modal';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header role={Role.ADMIN} />
      <div className="mt-28 ml-6 flex flex-col gap-6 px-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <div className="flex flex-row gap-6">
          <Dropdown
            label="Serviço"
            items={['Usuário 1', 'Usuário 2']}
            onSelect={(item) => console.log('Selecionou', item)}
          ></Dropdown>
          <Dropdown
            label="Cidade"
            items={['Usuário 1', 'Usuário 2']}
            onSelect={(item) => console.log('Selecionou', item)}
          ></Dropdown>
        </div>
      </div>
    </div>
  );
}
