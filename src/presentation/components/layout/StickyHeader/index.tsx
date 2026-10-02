'use client';

import { IChildren } from '@/core/types';
import { useScrolled } from '@/presentation/hooks/useScrolled';
import { STICKY_HEADER_THRESHOLD } from './constants';

export function StickyHeader({ children }: IChildren) {
  const scrolled = useScrolled(STICKY_HEADER_THRESHOLD);

  return (
    <>
      <div aria-hidden="true" className="h-[7.5rem] md:h-20" />
      <header
        data-scrolled={scrolled}
        className="group fixed inset-x-0 top-0 z-40 border-b border-transparent bg-zinc-950/0 transition-[background-color,border-color,box-shadow] duration-300 ease-out [view-transition-name:site-header] data-[scrolled=true]:border-zinc-800 data-[scrolled=true]:bg-zinc-950/85 data-[scrolled=true]:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.9)] data-[scrolled=true]:backdrop-blur-md"
      >
        {children}
      </header>
    </>
  );
}
