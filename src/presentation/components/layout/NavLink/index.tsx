'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/presentation/utils/cn';
import { NavLinkProps } from './types';

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative font-display uppercase tracking-widest transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-street-lime after:transition-transform after:duration-300 hover:text-street-lime',
        isActive
          ? 'text-street-lime after:scale-x-100'
          : 'text-zinc-300 after:scale-x-0 hover:after:scale-x-100',
        className,
      )}
    >
      {children}
    </Link>
  );
}
