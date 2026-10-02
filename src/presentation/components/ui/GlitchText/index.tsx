import { cn } from '@/presentation/utils/cn';
import { GlitchTextProps } from './types';

export function GlitchText({ text, as: Tag = 'span', className }: GlitchTextProps) {
  return (
    <Tag className={cn('glitch', className)} data-text={text}>
      {text}
    </Tag>
  );
}
