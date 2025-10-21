'use client';

import ProtectedPage from '@/components/ProtectedPage';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage requiredRole="ROLE_USER" redirectTo="/login">
      {children}
    </ProtectedPage>
  );
}
