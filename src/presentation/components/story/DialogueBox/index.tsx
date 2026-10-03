import { getSpeakerName } from '@/presentation/story/speakers';
import { SpritePortrait } from '../SpritePortrait';
import { DIALOGUE_LABELS } from './constants';
import { dialogueBoxStyles } from './styles';
import { DialogueBoxProps } from './types';

export function DialogueBox({ speaker, visibleText, onActivate }: DialogueBoxProps) {
  const speakerName = getSpeakerName(speaker);
  const narration = !speaker;
  const styles = dialogueBoxStyles({ narration });

  return (
    <div className={styles.root()}>
      <button
        type="button"
        onClick={onActivate}
        aria-label={DIALOGUE_LABELS.advance}
        className={styles.button()}
      >
        {speaker && speakerName && (
          <span className={styles.speaker()}>
            <SpritePortrait actor={speaker} />
            {speakerName}
          </span>
        )}
        <span aria-hidden="true" className={styles.text()}>
          {visibleText}
        </span>
        <span aria-hidden="true" className={styles.hint()}>
          {DIALOGUE_LABELS.continueHint}
        </span>
      </button>
    </div>
  );
}
