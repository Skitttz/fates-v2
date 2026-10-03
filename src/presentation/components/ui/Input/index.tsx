import { forwardRef, useId } from 'react';
import { cn } from '@/presentation/utils/cn';
import { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="font-display text-xs uppercase tracking-[0.2em] text-zinc-400"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-12 border-2 bg-zinc-900 px-4 text-base text-zinc-50 sm:text-sm placeholder-zinc-600 transition-colors focus:border-street-lime focus:outline-none focus-visible:ring-0',
            error ? 'border-street-orange' : 'border-zinc-700',
            className,
          )}
          {...props}
        />
        {error && (
          <span id={errorId} role="alert" className="text-xs font-medium text-street-orange">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
