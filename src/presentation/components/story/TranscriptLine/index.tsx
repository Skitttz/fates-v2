import { getSpeakerName } from '@/presentation/story/speakers';
import { CONDITION_LABELS } from './constants';
import { transcriptLineStyles } from './styles';
import { TranscriptLineProps } from './types';

export function TranscriptLine({ line }: TranscriptLineProps) {
  const narration = !line.speaker;
  const styles = transcriptLineStyles({ narration });

  return (
    <p className={styles.root()}>
      {line.when && (
        <span className={styles.condition()}>{CONDITION_LABELS[line.when.ollie]} </span>
      )}
      {line.speaker && (
        <strong className={styles.speaker()}>{getSpeakerName(line.speaker)}: </strong>
      )}
      {line.text}
    </p>
  );
}
