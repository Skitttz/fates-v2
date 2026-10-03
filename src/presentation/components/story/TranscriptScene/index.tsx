import { describeBackdrop } from '@/presentation/story/backdrop-descriptions';
import { TranscriptInteraction } from '../TranscriptInteraction';
import { TranscriptLine } from '../TranscriptLine';
import { transcriptSceneStyles } from './styles';
import { TranscriptSceneProps } from './types';

export function TranscriptScene({ scene }: TranscriptSceneProps) {
  const styles = transcriptSceneStyles();
  const backdrop = describeBackdrop(scene.backdrop);

  return (
    <section className={styles.root()}>
      {backdrop && <p className={styles.backdrop()}>{backdrop}</p>}
      {scene.lines.map((line, index) => (
        <TranscriptLine key={`${scene.id}-${index}`} line={line} />
      ))}
      {scene.interaction && <TranscriptInteraction interaction={scene.interaction} />}
    </section>
  );
}
