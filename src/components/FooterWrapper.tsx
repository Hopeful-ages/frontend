'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  if (pathname === '/' || pathname === '/pesquisa')
    return (
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    );
  return <Footer />;
}
