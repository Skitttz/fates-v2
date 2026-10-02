import { cn } from '@/presentation/utils/cn';
import { MarqueeProps } from './types';

export function Marquee({
  items,
  reverse = false,
  separator = '✦',
  className,
  itemClassName,
}: MarqueeProps) {
  const content = items.flatMap((item, index) => [
    <span key={`item-${index}`} className={itemClassName}>
      {item}
    </span>,
    <span key={`sep-${index}`} aria-hidden="true" className="opacity-70">
      {separator}
    </span>,
  ]);

  return (
    <div className={cn('group flex overflow-hidden', className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            'flex min-w-full shrink-0 items-center justify-around gap-8 pr-8 group-hover:[animation-play-state:paused]',
            reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          )}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
