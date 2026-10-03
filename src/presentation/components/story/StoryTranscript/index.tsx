import { TranscriptScene } from '../TranscriptScene';
import { storyTranscriptStyles } from './styles';
import { StoryTranscriptProps } from './types';

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
