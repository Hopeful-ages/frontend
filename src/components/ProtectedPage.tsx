'use client';

import { ReactNode } from 'react';
import { useProtectedPage } from '@/hooks/useProtectedPage';
import Loading from './Loading';

type Role = 'ROLE_ADMIN' | 'ROLE_USER';

interface ProtectedPageProps {
  children: ReactNode;
  requiredRole?: Role;
  redirectTo?: string;
}

export default function ProtectedPage({
  children,
  requiredRole,
  redirectTo,
}: ProtectedPageProps) {
  const { isLoading, hasAccess } = useProtectedPage({
    requiredRole,
    redirectTo,
  });

  if (isLoading) {
    return <Loading text="Verificando permissões..." />;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
