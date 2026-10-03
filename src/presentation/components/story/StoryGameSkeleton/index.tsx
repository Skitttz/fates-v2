import { Skeleton } from '@/presentation/components/ui';
import { STORY_SKELETON_LABEL } from './constants';
import { storyGameSkeletonStyles } from './styles';

export function StoryGameSkeleton() {
  const styles = storyGameSkeletonStyles();

  return (
    <div role="status" aria-label={STORY_SKELETON_LABEL} className={styles.root()}>
      <Skeleton className={styles.toolbar()} />
      <Skeleton className={styles.canvas()} />
      <Skeleton className={styles.dialogue()} />
    </div>
  );
}
