import { memo } from 'react';
import { WALK_HINT_LABELS } from './constants';
import { walkHintStyles } from './styles';

export const WalkHint = memo(function WalkHint() {
  const styles = walkHintStyles();

  return (
    <div className={styles.root()}>
      <p>{WALK_HINT_LABELS.goal}</p>
      <p className={styles.keys()}>{WALK_HINT_LABELS.keys}</p>
    </div>
  );
});
