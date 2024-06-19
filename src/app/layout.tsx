import { IChildren } from '@/core/types';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Fates',
  description: 'simple website clothing',
};

export default function RootLayout({ children }: IChildren) {
  return (
    <html className={inter.variable} lang="en">
      <body className="bg-zinc-950 text-zinc-50 antialiased">{children}</body>
    </html>
  );
}
