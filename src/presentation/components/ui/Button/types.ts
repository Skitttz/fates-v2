import { ButtonHTMLAttributes } from 'react';

export type Variant = 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';

export type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export type ButtonVariantsParams = {
  variant?: Variant;
  size?: Size;
  className?: string;
};
