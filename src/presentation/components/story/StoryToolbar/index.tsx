import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '@/presentation/components/ui';
import { SOUND_ON_CLASS, TOOLBAR_LABELS } from './constants';
import { StoryToolbarProps } from './types';

export function StoryToolbar({ mode, ended, sound, onSkip, onToggleMode }: StoryToolbarProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {sound && (
        <button
          type="button"
          aria-pressed={sound.enabled}
          onClick={sound.onToggle}
          className={buttonVariants({
            variant: sound.enabled ? 'outline' : 'ghost',
            size: 'sm',
            className: sound.enabled ? SOUND_ON_CLASS : 'min-h-12',
          })}
        >
          {sound.enabled ? (
            <SpeakerWaveIcon aria-hidden="true" className="size-4 motion-safe:animate-pulse" />
          ) : (
            <SpeakerXMarkIcon aria-hidden="true" className="size-4" />
          )}
          {sound.enabled ? TOOLBAR_LABELS.soundOn : TOOLBAR_LABELS.soundOff}
        </button>
      )}
      <button
        type="button"
        onClick={onToggleMode}
        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'min-h-12' })}
      >
        {mode === 'game' ? TOOLBAR_LABELS.readAsText : TOOLBAR_LABELS.backToGame}
      </button>
      {mode === 'game' && !ended && (
        <button
          type="button"
          onClick={onSkip}
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'min-h-12' })}
        >
          {TOOLBAR_LABELS.skip}
        </button>
      )}
    </div>
  );
}
