import { AnchorHTMLAttributes } from 'react';

export interface AnchorLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: `#${string}`;
}
