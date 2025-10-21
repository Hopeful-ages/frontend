'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();

  const noHeaderRoutes = ['/register', '/forgot-password'];

  if (noHeaderRoutes.includes(pathname)) return null;

  return <Header />;
}
