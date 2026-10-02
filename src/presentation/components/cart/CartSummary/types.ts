import { ReactNode } from 'react';

export interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  children: ReactNode;
}
