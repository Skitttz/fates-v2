import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import logo from '@/presentation/assets/logo.svg';
import { ROUTES } from '@/presentation/constants/route';
import { AccountMenu } from '../AccountMenu';
import { CartButton } from '../CartButton';
import { NavLink } from '../NavLink';
import { NAV_ITEMS } from './constants';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
      <div className="tape h-1" aria-hidden="true" />
      <div className="mx-auto flex h-16 max-w-[100em] items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href={ROUTES.HOME}
          aria-label="Fates, página inicial"
          className="transition-transform duration-300 hover:-rotate-3 hover:scale-105"
        >
          <Image src={logo} width={92} height={42} alt="Fates" priority />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={ROUTES.PRODUCTS}
            aria-label="Buscar produtos"
            className="text-zinc-300 transition-colors hover:text-street-lime"
          >
            <MagnifyingGlassIcon className="size-5" />
          </Link>
          <AccountMenu />
          <CartButton />
        </div>
      </div>

      <nav
        aria-label="Principal mobile"
        className="flex h-10 items-center justify-center gap-8 border-t border-zinc-800 text-xs md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
