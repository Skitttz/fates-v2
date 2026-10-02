import { ReactNode } from 'react';

export interface ErrorStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}
