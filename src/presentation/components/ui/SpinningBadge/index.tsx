import { cn } from '@/presentation/utils/cn';
import { SpinningBadgeProps } from './types';

export function SpinningBadge({ text, className }: SpinningBadgeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative grid size-28 place-items-center rounded-full bg-street-yellow text-black sm:size-32',
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-black font-display text-[11px] uppercase tracking-[0.18em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="font-marker text-2xl">F</span>
    </div>
  );
}
