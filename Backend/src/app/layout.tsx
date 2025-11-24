import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Masjid Syamsul Ulum',
  description: 'Sistem Manajemen Keuangan Masjid Syamsul Ulum - Professional MVC Architecture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
