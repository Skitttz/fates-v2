'use client';

import { MouseEvent } from 'react';
import { smoothScrollTo } from '@/presentation/helpers/view-transition';
import { AnchorLinkProps } from './types';

/** link para uma seção da mesma página com rolagem suave */
export function AnchorLink({ href, onClick, ...props }: AnchorLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (smoothScrollTo(href)) event.preventDefault();
  }

  return <a href={href} onClick={handleClick} {...props} />;
}
