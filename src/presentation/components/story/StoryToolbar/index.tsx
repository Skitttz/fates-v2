import { memo } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { TOOLBAR_LABELS } from './constants';
import { storyToolbarStyles } from './styles';
import { StoryToolbarProps } from './types';

export const StoryToolbar = memo(function StoryToolbar({
  mode,
  ended,
  sound,
  onSkip,
  onToggleMode,
}: StoryToolbarProps) {
  const soundOn = Boolean(sound?.enabled);
  const styles = storyToolbarStyles({ soundOn });
  const SoundIcon = soundOn ? SpeakerWaveIcon : SpeakerXMarkIcon;
  const soundLabel = soundOn ? TOOLBAR_LABELS.soundOn : TOOLBAR_LABELS.soundOff;
  const modeLabel = mode === 'game' ? TOOLBAR_LABELS.readAsText : TOOLBAR_LABELS.backToGame;
  const canSkip = mode === 'game' && !ended;

  return (
    <div className={styles.root()}>
      {sound && (
        <button
          type="button"
          aria-pressed={soundOn}
          onClick={sound.onToggle}
          className={styles.sound()}
        >
          <SoundIcon aria-hidden="true" className={styles.soundIcon()} />
          {soundLabel}
        </button>
      )}
      <button type="button" onClick={onToggleMode} className={styles.mode()}>
        {modeLabel}
      </button>
      {canSkip && (
        <button type="button" onClick={onSkip} className={styles.skip()}>
          {TOOLBAR_LABELS.skip}
        </button>
      )}
    </div>
  );
});
