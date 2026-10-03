import type { Metadata } from 'next';
import { Anton, Inter, Permanent_Marker } from 'next/font/google';
import { Suspense } from 'react';
import { IChildren } from '@/core/types';
import { AppProvidersFactory } from '@/main/providers/app-providers-factory';
import { ViewTransitionListener } from '@/presentation/components/navigation';
import { isDemoMode } from '@/main/config';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' });
const marker = Permanent_Marker({ subsets: ['latin'], weight: '400', variable: '--font-marker' });

export const metadata: Metadata = {
  title: {
    default: 'Fates',
    template: '%s | Fates',
  },
  description: 'Fates. Em movimento com a rua. Drop 01 disponível.',
};

export default function RootLayout({ children }: IChildren) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${anton.variable} ${marker.variable}`}>
      <body className="bg-zinc-950 font-sans text-zinc-50 antialiased">
        {isDemoMode() && (
          <p className="bg-street-yellow px-4 py-2 text-center text-sm font-semibold text-zinc-950">
            Modo demonstração: produtos e pedidos simulados. Nenhuma compra é realizada.
          </p>
        )}
        <AppProvidersFactory>{children}</AppProvidersFactory>
        <Suspense fallback={null}>
          <ViewTransitionListener />
        </Suspense>
      </body>
    </html>
  );
}
