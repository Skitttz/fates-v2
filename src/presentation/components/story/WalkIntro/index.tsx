import { WALK_INTRO_LABELS } from './constants';
import { WalkIntroProps } from './types';

export function WalkIntro({ animated }: WalkIntroProps) {
  return (
    <div className="flex h-full w-full items-start justify-center pt-[8%]">
      <div
        className={`border-2 border-zinc-50 bg-black/80 px-4 py-2 text-center font-pixel text-zinc-50 ${animated ? 'animate-page-in' : ''}`}
      >
        <p className="text-lg text-street-lime">{WALK_INTRO_LABELS.title}</p>
        <p className="hidden text-xs text-zinc-300 [@media(pointer:fine)]:block">
          {WALK_INTRO_LABELS.keys}
        </p>
        <p className="text-xs text-zinc-300 [@media(pointer:fine)]:hidden">
          {WALK_INTRO_LABELS.touch}
        </p>
      </div>
    </div>
  );
}
