import { GlitchText } from '@/presentation/components/ui';
import { ABOUT_PAGE } from './constants';
import { AboutLayoutProps } from './types';

export default function AboutLayout({ game }: AboutLayoutProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-8">
      <header className="flex flex-col gap-4">
        <span className="font-marker text-lg text-street-lime">{ABOUT_PAGE.eyebrow}</span>
        <h1 className="font-display text-5xl uppercase leading-none sm:text-7xl">
          <GlitchText text={ABOUT_PAGE.title} />
        </h1>
        <p className="max-w-md text-sm text-zinc-400 sm:text-base">{ABOUT_PAGE.description}</p>
      </header>
      {game}
    </div>
  );
}
