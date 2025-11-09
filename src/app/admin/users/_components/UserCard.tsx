'use client';

import { Button } from '@/components/Button';
import { UserResponseDTO } from '@/lib/types';
import { Pencil, UserRoundX } from 'lucide-react';

interface UserCardProps {
  user: UserResponseDTO;
  onEdit: (id: string) => void;
  onToggleAsk: (user: UserResponseDTO) => void;
}

export const UserCard = ({ user, onEdit, onToggleAsk }: UserCardProps) => {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <span className="text-xs text-gray-500">Nome</span>
        <p className="font-semibold text-gray-800">{user.name}</p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-gray-500">Serviço</span>
          <p className="truncate text-sm font-medium text-gray-700">
            {user.department?.name ?? '—'}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Cidade</span>
          <p className="truncate text-sm font-medium text-gray-700">
            {user.city?.name ?? '—'}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Ativo</span>
          <p
            className={`text-sm font-semibold ${
              user.accountStatus ? 'text-green-600' : 'text-yellow-700'
            }`}
          >
            {user.accountStatus ? 'Sim' : 'Não'}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onEdit(user.id)}
          leftIcon={<Pencil size={16} />}
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onToggleAsk(user)}
          leftIcon={<UserRoundX size={16} />}
        >
          {user.accountStatus ? 'Desativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
};
