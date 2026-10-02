import { forwardRef } from 'react';
import { cn } from '@/presentation/utils/cn';
import { ButtonProps, ButtonVariantsParams } from './types';
import { SIZES, VARIANTS } from './constants';

export const buttonVariants = ({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonVariantsParams = {}) =>
  cn(
    'inline-flex items-center justify-center gap-2 font-display uppercase tracking-wider transition-all duration-150 disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
