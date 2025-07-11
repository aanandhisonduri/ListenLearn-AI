'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      <main className="flex-grow position-relative z-1">{children}</main>
      {!isLanding && <Footer />}
    </>
  );
}
