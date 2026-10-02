import { ErrorStateProps } from './types';

export function ErrorState({ title = 'Deu ruim no rolê', message, action }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 border-2 border-dashed border-street-orange/60 px-6 py-16 text-center"
    >
      <span className="animate-flicker font-display text-5xl uppercase text-street-orange">
        {title}
      </span>
      <p className="max-w-md text-sm text-zinc-400">{message}</p>
      {action}
    </div>
  );
}
