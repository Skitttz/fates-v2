import { TRANSCRIPT_NOTES } from './constants';
import { transcriptInteractionStyles } from './styles';
import { TranscriptInteractionProps } from './types';

export function TranscriptInteraction({ interaction }: TranscriptInteractionProps) {
  const styles = transcriptInteractionStyles();

  if (interaction.type !== 'choice') {
    return <p className={styles.note()}>{TRANSCRIPT_NOTES[interaction.type]}</p>;
  }

  return (
    <div className={styles.choice()}>
      <p className={styles.note()}>{interaction.prompt}</p>
      <ul className={styles.options()}>
        {interaction.options.map((option) => (
          <li key={option.id}>{`${option.label}: ${option.outcome}`}</li>
        ))}
      </ul>
    </div>
  );
}
