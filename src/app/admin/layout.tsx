'use client';

// Update the import path if the alias '@' is not configured or incorrect
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
