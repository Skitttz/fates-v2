import { memo } from 'react';
import { WALK_HINT_LABELS } from './constants';
import { walkHintStyles } from './styles';

export const WalkHint = memo(function WalkHint({ bumps = 0 }: { bumps?: number }) {
  const styles = walkHintStyles();

  return (
    <div className={styles.root()}>
      <p>{WALK_HINT_LABELS.goal}</p>
      {bumps > 0 && (
        <p role="status" className={styles.feedback()}>
          {bumps >= 2 ? WALK_HINT_LABELS.jump : WALK_HINT_LABELS.bump}
        </p>
      )}
      <p className={styles.shortcuts()}>{WALK_HINT_LABELS.keys}</p>
    </div>
  );
});
