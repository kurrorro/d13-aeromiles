import type { Metadata } from 'next';
import './globals.css';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'AeroMiles',
  description: 'Sistem Manajemen Miles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SessionProviderWrapper>
          <Navbar />
          <main className="p-6">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}