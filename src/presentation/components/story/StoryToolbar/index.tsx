import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '@/presentation/components/ui';
import { TOOLBAR_LABELS } from './constants';
import { storyToolbarStyles } from './styles';
import { StoryToolbarProps } from './types';

export function StoryToolbar({ mode, ended, sound, onSkip, onToggleMode }: StoryToolbarProps) {
  const soundOn = Boolean(sound?.enabled);
  const styles = storyToolbarStyles({ soundOn });
  const SoundIcon = soundOn ? SpeakerWaveIcon : SpeakerXMarkIcon;
  const soundLabel = soundOn ? TOOLBAR_LABELS.soundOn : TOOLBAR_LABELS.soundOff;
  const modeLabel = mode === 'game' ? TOOLBAR_LABELS.readAsText : TOOLBAR_LABELS.backToGame;
  const canSkip = mode === 'game' && !ended;
  const soundClass = buttonVariants({ variant: 'ghost', size: 'sm', className: styles.sound() });
  const modeClass = buttonVariants({ variant: 'outline', size: 'sm', className: styles.action() });
  const skipClass = buttonVariants({ variant: 'ghost', size: 'sm', className: styles.action() });

  return (
    <div className={styles.root()}>
      {sound && (
        <button
          type="button"
          aria-pressed={soundOn}
          onClick={sound.onToggle}
          className={soundClass}
        >
          <SoundIcon aria-hidden="true" className={styles.soundIcon()} />
          {soundLabel}
        </button>
      )}
      <button type="button" onClick={onToggleMode} className={modeClass}>
        {modeLabel}
      </button>
      {canSkip && (
        <button type="button" onClick={onSkip} className={skipClass}>
          {TOOLBAR_LABELS.skip}
        </button>
      )}
    </div>
  );
}
