import type { Metadata } from 'next';
import { Anton, Inter, Permanent_Marker, Pixelify_Sans } from 'next/font/google';
import { Suspense } from 'react';
import { IChildren } from '@/core/types';
import { AppProvidersFactory } from '@/main/providers/app-providers-factory';
import { ViewTransitionListener } from '@/presentation/components/navigation';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' });
const marker = Permanent_Marker({ subsets: ['latin'], weight: '400', variable: '--font-marker' });
const pixel = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  title: {
    default: 'Fates',
    template: '%s | Fates',
  },
  description: 'Fates. Em movimento com a rua. Drop 01 disponível.',
};

export default function RootLayout({ children }: IChildren) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${anton.variable} ${marker.variable} ${pixel.variable}`}
    >
      <body className="bg-zinc-950 font-sans text-zinc-50 antialiased">
        <AppProvidersFactory>{children}</AppProvidersFactory>
        <Suspense fallback={null}>
          <ViewTransitionListener />
        </Suspense>
      </body>
    </html>
  );
}
