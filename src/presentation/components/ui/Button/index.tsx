import { forwardRef } from 'react';
import { buttonStyles } from './styles';
import { ButtonProps, ButtonVariantsParams } from './types';

export const buttonVariants = ({ variant, size, className }: ButtonVariantsParams = {}) =>
  buttonStyles({ variant, size, className });

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
