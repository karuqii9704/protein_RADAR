import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import Providers from '@/components/Providers';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
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
    <html lang="id" className={poppins.variable}>
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
