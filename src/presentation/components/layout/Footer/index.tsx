import Link from 'next/link';

import { FOOTER_LINKS } from './constants';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800">
      <div className="mx-auto flex max-w-[100em] flex-col gap-10 px-4 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-sm space-y-3">
            <p className="font-marker text-xl text-street-lime">feito na rua, pra rua.</p>
            <p className="text-sm text-zinc-400">
              Fates é uma vitrine fictícia de streetwear criada para estudar Clean Architecture com
              Next.js. Nenhuma compra aqui é real.
            </p>
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

        <p
          aria-hidden="true"
          className="text-outline select-none text-center font-display text-[22vw] leading-[0.8] transition-colors duration-500 hover:text-street-lime md:text-[16vw]"
        >
          FATES
        </p>

        <p className="text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Fates Crew. Projeto de estudo.
        </p>
      </div>
    </footer>
  );
}
