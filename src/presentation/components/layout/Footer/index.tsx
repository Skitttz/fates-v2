import { Link } from '@/presentation/components/navigation';
import { GraffitiTag } from '@/presentation/components/ui';

import { FOOTER_COPY, FOOTER_LINKS } from './constants';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800">
      <div className="mx-auto flex max-w-[100em] flex-col gap-10 px-4 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-sm space-y-3">
            <p className="font-marker text-xl text-street-lime">{FOOTER_COPY.tagline}</p>
            <p className="text-sm text-zinc-400">{FOOTER_COPY.about}</p>
          </div>
          <nav aria-label="Rodapé" className="flex gap-8">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-sm uppercase tracking-widest text-zinc-300 transition-colors hover:text-street-lime"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <GraffitiTag
          text={FOOTER_COPY.wordmark}
          className="mx-auto max-w-5xl cursor-crosshair text-zinc-700"
        />

        <p className="text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {FOOTER_COPY.copyright}
        </p>
      </div>
    </footer>
  );
}
