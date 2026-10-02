import { cn } from '@/presentation/utils/cn';
import { SectionHeadingProps } from './types';

export function SectionHeading({
  id,
  title,
  eyebrow,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 flex flex-col gap-4 sm:mb-14', className)}>
      {eyebrow && <span className="font-marker text-lg text-street-lime">{eyebrow}</span>}
      <div className="flex items-center gap-4">
        <h2
          id={id}
          className="shrink-0 font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>
        <div
          aria-hidden="true"
          className="h-1 flex-1 bg-gradient-to-r from-street-lime via-street-lime/40 to-transparent"
        />
        {action}
      </div>
      {description && <p className="max-w-md text-sm text-zinc-400 sm:text-base">{description}</p>}
    </div>
  );
}
