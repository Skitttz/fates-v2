import Image from 'next/image';
import { Link } from '@/presentation/components/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import logo from '@/presentation/assets/logo.svg';
import { ROUTES } from '@/presentation/constants/route';
import { AccountMenu } from '../AccountMenu';
import { CartButton } from '../CartButton';
import { NavLink } from '../NavLink';
import { StickyHeader } from '../StickyHeader';
import { NAV_ITEMS } from './constants';

export function Header() {
  return (
    <StickyHeader>
      <div className="mx-auto flex h-20 max-w-[100em] items-center justify-between gap-4 px-4 transition-[height] duration-300 ease-out group-data-[scrolled=true]:h-14 sm:px-8">
        <Link
          href={ROUTES.HOME}
          aria-label="Fates, página inicial"
          className="transition-transform duration-300 hover:-rotate-3 hover:scale-105"
        >
          <span className="block origin-left transition-transform duration-300 ease-out group-data-[scrolled=true]:scale-[0.82]">
            <Image src={logo} width={92} height={42} alt="Fates" priority />
          </span>
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
    </StickyHeader>
  );
}
