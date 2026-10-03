import { getSpeakerName } from '@/presentation/story/speakers';
import { cn } from '@/presentation/utils/cn';
import { SpritePortrait } from '../SpritePortrait';
import { DIALOGUE_LABELS } from './constants';
import { DialogueBoxProps } from './types';

export function DialogueBox({ speaker, visibleText, onActivate }: DialogueBoxProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onActivate}
        aria-label={DIALOGUE_LABELS.advance}
        className="flex min-h-28 w-full touch-manipulation flex-col gap-2 border-4 border-zinc-50 bg-black p-4 text-left font-pixel text-base leading-relaxed text-zinc-50 sm:text-lg"
      >
        {speaker && speakerName && (
          <span className="flex items-center gap-2 text-street-lime">
            <SpritePortrait actor={speaker} />
            {speakerName}
          </span>
        )}
        <span aria-hidden="true" className={cn(!speaker && 'italic text-zinc-300')}>
          {visibleText}
        </span>
        <span aria-hidden="true" className="absolute bottom-2 right-3 animate-pulse text-xs">
          {DIALOGUE_LABELS.continueHint}
        </span>
      </button>
    </div>
  );
}
