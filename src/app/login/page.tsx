'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Input } from '../../components/Input';

import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { useLoading } from '@/providers/LoadingProvider';
import { Lock, Send, User } from 'lucide-react';
import { Dropdown } from '@/components/Dropdown';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { isCheckingAuth, isAuthenticated } = useAuthRedirect();

  const { showLoading, hideLoading } = useLoading();
  const { success, warning } = useToast();

  const loadingShown = useRef(false);

  useEffect(() => {
    if (isCheckingAuth) {
      showLoading('Verificando autenticação...');
      if (!loadingShown.current) {
        // warning('Atenção!!', 'Verificando autenticação...');
        loadingShown.current = true;
      }
    } else {
      hideLoading();
      if (isAuthenticated) {
        showLoading('Redirecionando...');
        router.push('/');
      }
    }
  }, [
    isCheckingAuth,
    isAuthenticated,
    showLoading,
    hideLoading,
    warning,
    router,
  ]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      showLoading('Entrando...');
      const result = await api.login(username, password);

      if (result.redirectTo) {
        router.push(result.redirectTo);
        success('Autenticado com sucesso!');
      } else {
        router.push('/');
        success('Autenticado com sucesso!');
      }
    } catch {
      setError('Usuário ou senha inválidos. Tente novamente.');
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-lg bg-black p-2">
            <Image
              src="/hopefulIcon.png"
              alt="Hopeful Icon"
              width={80}
              height={80}
            />
          </div>
          <h1 className="mb-8 text-4xl font-semibold text-black">Hopeful</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            icon={<User />}
            type="text"
            placeholder="Usuário ou Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            icon={<Lock />}
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex justify-end">
            <Link
              href="/esqueci-senha"
              className="text-sm text-gray-600 hover:text-black hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-black text-white hover:bg-gray-800 focus-visible:ring-black"
              loading={isLoading}
              leftIcon={<Send size={20} />}
            >
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
