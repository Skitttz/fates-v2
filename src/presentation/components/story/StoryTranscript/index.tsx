import { describeBackdrop } from '@/presentation/story/backdrop-descriptions';
import { getSpeakerName } from '@/presentation/story/speakers';
import { CONDITION_LABELS, TRANSCRIPT_NOTES } from './constants';
import { storyTranscriptStyles } from './styles';
import {
  StoryTranscriptProps,
  TranscriptInteractionProps,
  TranscriptLineProps,
  TranscriptSceneProps,
} from './types';

function TranscriptLine({ line }: TranscriptLineProps) {
  const narration = !line.speaker;
  const styles = storyTranscriptStyles({ narration });

  return (
    <p className={styles.line()}>
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

function TranscriptInteraction({ interaction }: TranscriptInteractionProps) {
  const styles = storyTranscriptStyles();

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

function TranscriptScene({ scene }: TranscriptSceneProps) {
  const styles = storyTranscriptStyles();
  const backdrop = describeBackdrop(scene.backdrop);

  return (
    <section className={styles.scene()}>
      {backdrop && <p className={styles.backdrop()}>{backdrop}</p>}
      {scene.lines.map((line, index) => (
        <TranscriptLine key={`${scene.id}-${index}`} line={line} />
      ))}
      {scene.interaction && <TranscriptInteraction interaction={scene.interaction} />}
    </section>
  );
}

export function StoryTranscript({ story }: StoryTranscriptProps) {
  const styles = storyTranscriptStyles();

  return (
    <article className={styles.root()}>
      {story.scenes.map((scene) => (
        <TranscriptScene key={scene.id} scene={scene} />
      ))}
      <p className={styles.epilogue()}>{story.epilogue}</p>
    </article>
  );
}
