'use client';

export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { ChevronLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Captura o token da URL

  useEffect(() => {
    if (!token) {
      toastError('Token inválido ou ausente');
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toastError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const cleanPassword = password.trim();
      console.log('Dados enviados:', { password: cleanPassword, token }); // Adicione este log
      await api.post('/api/auth/reset-password', {
        password: cleanPassword,
        token,
      });
      success('Senha redefinida com sucesso');
    } catch (error) {
      toastError('Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="absolute top-4 left-4">
          <Link href="/login">
            <Button
              variant="terciary"
              size="icon"
              className="!bg-black !text-white hover:!bg-black focus-visible:!bg-black"
            >
              <ChevronLeft size={24} />
            </Button>
          </Link>
        </div>
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

        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-center text-2xl font-medium text-gray-800">
            Nova Senha
          </p>

          <Input
            type="password"
            placeholder="Nova Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              size="md"
              className="!bg-black !text-white hover:!bg-gray-700 focus-visible:!bg-black"
              loading={isLoading}
              disabled={!password || !confirmPassword || !token}
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
