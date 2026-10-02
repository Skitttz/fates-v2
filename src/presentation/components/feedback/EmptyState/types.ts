import { ReactNode } from 'react';

export interface EmptyStateProps {
  sticker: string;
  title: string;
  description?: string;
  action?: ReactNode;
}
