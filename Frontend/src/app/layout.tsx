import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Providers from '@/components/Providers';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Dashboard Masjid Syamsul Ulum',
  description: 'Sistem Manajemen Keuangan Masjid Syamsul Ulum Telkom University',
  icons: {
    icon: '/icon-masjid.png',
    apple: '/icon-masjid.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
