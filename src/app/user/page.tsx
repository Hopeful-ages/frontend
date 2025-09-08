'use client';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();
  const { isLoading, userInfo, hasAccess, logout } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!hasAccess || !userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard do Usuário
            </h1>
            <button
              onClick={logout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Sair
            </button>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-xl font-semibold">
              Informações do Usuário
            </h2>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>ID:</strong> {userInfo.sub}
            </p>
            <p>
              <strong>Roles:</strong> {userInfo.roles.join(', ')}
            </p>
            <p>
              <strong>Token expira em:</strong>{' '}
              {new Date(userInfo.exp * 1000).toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-600">
              ✅ Acesso autorizado como USER
            </h3>
            <p className="mt-2 text-gray-600">
              Esta é a área para usuários autenticados.
            </p>

            {userInfo.roles.includes('ROLE_ADMIN') && (
              <div className="mt-4 rounded-lg bg-yellow-50 p-4">
                <p className="text-yellow-800">
                  🔑 Você também tem privilégios de ADMIN.
                  <button
                    onClick={() => router.push('/admin')}
                    className="ml-2 text-blue-600 underline hover:text-blue-800"
                  >
                    Ir para área de Admin
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
