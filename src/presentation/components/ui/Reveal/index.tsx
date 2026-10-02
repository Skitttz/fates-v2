'use client';

import { useInView } from '@/presentation/hooks/useInView';
import { cn } from '@/presentation/utils/cn';
import { RevealProps } from './types';

export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
  style,
  ...props
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref}
      data-visible={inView}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100',
        inView ? 'translate-y-0 skew-y-0 opacity-100' : 'translate-y-10 skew-y-2 opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
