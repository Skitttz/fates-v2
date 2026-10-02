import { cn } from '@/presentation/utils/cn';
import { StickerProps } from './types';
import { TAG_COLORS } from './constants';

export function Sticker({ label, className, animated = false }: StickerProps) {
  return (
    <span
      className={cn(
        'inline-block -rotate-6 border-2 border-black px-2.5 py-1 font-marker text-sm leading-none text-black shadow-brutal-sm',
        TAG_COLORS[label] ?? 'bg-street-yellow',
        animated && 'animate-wobble',
        className,
      )}
    >
      {label}
    </span>
  );
}
