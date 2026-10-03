import { tv } from '@/presentation/styles/tv';

export const buttonStyles = tv({
  base: 'inline-flex items-center justify-center gap-2 font-display uppercase tracking-wider transition-all duration-150 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary:
        'bg-street-lime text-black border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none',
      secondary:
        'bg-street-orange text-black border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none',
      success: 'bg-street-cyan text-black border-2 border-black shadow-brutal',
      outline:
        'border-2 border-zinc-50 text-zinc-50 hover:bg-zinc-50 hover:text-black hover:shadow-brutal-lime',
      ghost: 'text-zinc-300 hover:text-street-lime',
    },
    size: {
      sm: 'h-9 px-4 text-xs',
      md: 'h-11 px-6 text-sm',
      lg: 'h-14 px-8 text-base',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
