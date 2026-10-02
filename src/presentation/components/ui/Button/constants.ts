import { Size, Variant } from './types';

export const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-street-lime text-black border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none',
  secondary:
    'bg-street-orange text-black border-2 border-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none',
  success: 'bg-street-cyan text-black border-2 border-black shadow-brutal',
  outline:
    'border-2 border-zinc-50 text-zinc-50 hover:bg-zinc-50 hover:text-black hover:shadow-brutal-lime',
  ghost: 'text-zinc-300 hover:text-street-lime',
};

export const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};
