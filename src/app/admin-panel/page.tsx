'use client';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import Header, { Role } from '@/components/Header';
import { UserPlus } from 'lucide-react';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header role={Role.ADMIN} />
      <div className="mt-28 ml-6 flex flex-col gap-6 px-6">
        <h1 className="text-3xl font-bold">Usuários</h1>

        {/* Container flex com justify-between */}
        <div className="flex w-full items-center justify-between">
          {/* Dropdowns alinhados à esquerda */}
          <div className="flex flex-row gap-6">
            <Dropdown
              label="Serviço"
              items={['Usuário 1', 'Usuário 2']}
              onSelect={(item) => console.log('Selecionou', item)}
            />
            <Dropdown
              label="Cidade"
              items={['Usuário 1', 'Usuário 2']}
              onSelect={(item) => console.log('Selecionou', item)}
            />
          </div>

          <Button onClick={() => console.log('Clicou')} variant="ghost">
            <UserPlus size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
