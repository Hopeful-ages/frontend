'use client';

import ProtectedPage from '../../components/ProtectedPage';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage requiredRole="ROLE_ADMIN" redirectTo="/">
      {children}
    </ProtectedPage>
  );
}
