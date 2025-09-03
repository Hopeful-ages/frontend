'use client';

import React, { useEffect, useState } from 'react';
import Table, { Column, PencilIcon, TrashIcon } from '@/app/components/Table';

type UserRow = {
  id: string;
  nome: string;
  servico: string;
  cidade: string;
};

type UsuarioAPI = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string | null;
  servico: string;
  cidade: string;
};

const columns: Column<UserRow>[] = [
  { header: 'Nome', accessor: 'nome', sortable: true },
  { header: 'Serviço', accessor: 'servico', sortable: true },
  { header: 'Cidade', accessor: 'cidade', sortable: true },
  {
    header: '',
    type: 'actions',
    actions: [
      { id: 'edit', title: 'Editar', icon: PencilIcon },
      { id: 'delete', title: 'Excluir', icon: TrashIcon },
    ],
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function UsersTableData() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_URL}/user`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: UsuarioAPI[] = await res.json();

        const mapped: UserRow[] = data.map((u) => ({
          id: u.id,
          nome: u.nome,
          servico: u.servico,
          cidade: u.cidade,
        }));

        setRows(mapped);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleAction(actionId: string, row: UserRow) {
    console.log('Ação:', actionId, row);
  }

  if (loading) return <div className="p-4">Carregando...</div>;
  if (err) return <div className="p-4 text-red-600">Erro: {err}</div>;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h2 className="mb-3 text-lg font-semibold">Usuários</h2>
      <Table<UserRow>
        columns={columns}
        rows={rows}
        onAction={handleAction}
        getRowId={(r) => r.id}
      />
    </div>
  );
}
