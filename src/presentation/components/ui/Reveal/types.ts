import { ElementType, HTMLAttributes } from 'react';

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  delay?: number;
}
