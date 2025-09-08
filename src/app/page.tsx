'use client';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import LoginPage from './login/page';

export default function Home() {
  const { isCheckingAuth, isAuthenticated } = useAuthRedirect();

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg">Verificando autenticação...</div>
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <LoginPage />
    </main>
  );
}
