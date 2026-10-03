import type { Metadata } from 'next';
import { AboutFactory } from '@/main/pages/about/about-factory';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Como a Fates nasceu numa pista de Aracaju, contado em forma de jogo.',
};

export default function AboutRouter() {
  return <AboutFactory />;
}
