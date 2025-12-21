'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  // Admin routes have their own layout (AdminSidebar + AdminHeader)
  // So we don't show the public Header and Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Public routes show Header and Footer
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
