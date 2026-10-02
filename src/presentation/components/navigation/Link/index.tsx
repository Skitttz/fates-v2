'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, MouseEvent } from 'react';
import { startPageTransition } from '@/presentation/helpers/view-transition';
import { LinkProps } from './types';

const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

/** next/link com transição animada entre páginas (View Transitions API) */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, onClick, replace, scroll, target, ...props }, ref) => {
    const router = useRouter();

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);
      if (event.defaultPrevented || isModifiedClick(event) || (target && target !== '_self')) {
        return;
      }

      const url = typeof href === 'string' ? href : event.currentTarget.getAttribute('href');
      if (!url || !url.startsWith('/')) return;

      const current = `${window.location.pathname}${window.location.search}`;
      if (url === current) return;

      event.preventDefault();
      startPageTransition(() => {
        if (replace) router.replace(url, { scroll });
        else router.push(url, { scroll });
      });
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        replace={replace}
        scroll={scroll}
        target={target}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

Link.displayName = 'Link';
