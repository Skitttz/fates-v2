import { Sticker } from '@/presentation/components/ui';
import { EmptyStateProps } from './types';

export function EmptyState({ sticker, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-5 border-2 border-dashed border-zinc-700 px-6 py-20 text-center">
      <Sticker label={sticker} animated className="text-2xl" />
      <h2 className="font-display text-3xl uppercase">{title}</h2>
      {description && <p className="max-w-md text-sm text-zinc-400">{description}</p>}
      {action}
    </div>
  );
}
