import type { Metadata } from 'next';
import { Anton, Inter, Permanent_Marker } from 'next/font/google';
import { IChildren } from '@/core/types';
import { AppProvidersFactory } from '@/main/providers/app-providers-factory';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' });
const marker = Permanent_Marker({ subsets: ['latin'], weight: '400', variable: '--font-marker' });

export const metadata: Metadata = {
  title: {
    default: 'Fates | Streetwear',
    template: '%s | Fates',
  },
  description: 'Vitrine de streetwear da Fates Crew. Drop 01 disponível.',
};

export default function RootLayout({ children }: IChildren) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${anton.variable} ${marker.variable}`}>
      <body className="bg-zinc-950 font-sans text-zinc-50 antialiased">
        <AppProvidersFactory>{children}</AppProvidersFactory>
      </body>
    </html>
  );
}
