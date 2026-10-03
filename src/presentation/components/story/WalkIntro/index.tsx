import { WALK_INTRO_LABELS } from './constants';
import { walkIntroStyles } from './styles';
import { WalkIntroProps } from './types';

export function WalkIntro({ animated }: WalkIntroProps) {
  const styles = walkIntroStyles({ animated });

  return (
    <div className={styles.root()}>
      <div className={styles.card()}>
        <p className={styles.title()}>{WALK_INTRO_LABELS.title}</p>
        <p className={styles.shortcuts()}>{WALK_INTRO_LABELS.keys}</p>
        <p className={styles.touch()}>{WALK_INTRO_LABELS.touch}</p>
      </div>
    </div>
  );
}
