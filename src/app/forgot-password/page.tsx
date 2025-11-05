'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { useLoading } from '@/providers/LoadingProvider';
import { ChevronLeft, Mail, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const { showLoading, hideLoading } = useLoading();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      showLoading('Enviando...');
      const data = await api.post('/api/auth/forgot-password', { email });
      const message = data?.message || 'Enviamos um link para redefinir sua senha';
      success(message);
      router.push('/login');
    } catch (error) {
      if (error && (error as any).status === 400) {
        const err = error as any;
        const errMsg = err.data?.error || 'Email é obrigatório';
        toastError(errMsg);
      } else {
        toastError('Erro ao solicitar recuperação de senha');
      }
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <div className="absolute left-4 top-4">
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

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-center text-2xl font-medium text-gray-800">
            Esqueceu sua senha ?
          </p>
          <p className="text-center text-sm text-gray-400">
            Informe o seu e-mail para o qual deseja redefinir sua senha
          </p>

          <Input
            icon={<Mail />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              size="md"
              className="!bg-black !text-white hover:!bg-gray-700 focus-visible:!bg-black"
              loading={isLoading}
              disabled={!email || !isEmailValid(email)}
              leftIcon={<Send size={16} />}
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
