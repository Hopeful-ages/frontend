'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

import { FaUser, FaLock } from 'react-icons/fa';
import { IoPaperPlaneOutline } from 'react-icons/io5';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulação de uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Lógica de validação (substitua por sua chamada de API real)
    if (username === 'usuario' && password === 'senha123') {
      alert('Login bem-sucedido!');
      // Aqui você redirecionaria o usuário: router.push('/dashboard')
    } else {
      setError('Usuário ou senha inválidos. Por favor, tente novamente.');
    }

    setIsLoading(false);
  };

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
            icon={<FaUser />}
            type="text"
            placeholder="Usuário ou Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            icon={<FaLock />}
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
              leftIcon={<IoPaperPlaneOutline size={20} />}
            >
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
