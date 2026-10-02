import { ReactNode } from 'react';

export interface SectionHeadingProps {
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}
