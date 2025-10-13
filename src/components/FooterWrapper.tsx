'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  const hiddenRoutes = ['/login'];

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <footer className="z-50 w-full border-t border-gray-200 bg-white shadow-sm">
      <Footer />
    </footer>
  );
}
