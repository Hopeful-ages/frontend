'use client';

import type React from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/providers/LoadingProvider';
import { Lock, Send } from 'lucide-react';

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { success, error: showError } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const validatePassword = (value: string): string => {
    if (!value) return 'Obrigatório';
    if (value.length < 6 || value.length > 100) {
      return 'Senha deve ter 6–100 caracteres';
    }
    return '';
  };

  const validateConfirmPassword = (value: string): string => {
    if (!value) return 'Obrigatório';
    if (value !== password) {
      return 'As senhas não coincidem';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      const error = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: error || undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      const error = validateConfirmPassword(value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: error || undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError || undefined,
        confirmPassword: confirmPasswordError || undefined,
      });
      return;
    }

    if (!token) {
      showError(
        'Token inválido ou expirado. Solicite um novo link de redefinição.',
      );
      return;
    }

    setIsLoading(true);
    showLoading('Redefinindo senha...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      success('Senha redefinida com sucesso!');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      showError('Não foi possível redefinir a senha. Tente novamente.');
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };

  const canSubmit = password.trim() && confirmPassword.trim();

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
          <h1 className="mb-2 text-4xl font-semibold text-black">Hopeful</h1>
          <p className="mb-8 text-center text-sm text-gray-600">
            Digite sua nova senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={<Lock />}
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            disabled={isLoading}
            error={errors.password}
            required
          />

          <Input
            icon={<Lock />}
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            disabled={isLoading}
            error={errors.confirmPassword}
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-black text-white hover:bg-gray-800 focus-visible:ring-black"
              loading={isLoading}
              disabled={!canSubmit}
              leftIcon={<Send size={20} />}
            >
              Redefinir Senha
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Carregando...</div>
        </div>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  );
}
