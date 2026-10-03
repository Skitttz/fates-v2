'use client';

import { memo, MouseEvent } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { WalkDirection } from '@/presentation/hooks/useWalk';
import { TOUCH_LABELS } from './constants';
import { touchControlsStyles } from './styles';
import { TouchControlsProps } from './types';

const preventContextMenu = (event: MouseEvent) => event.preventDefault();

export const TouchControls = memo(function TouchControls({
  visible,
  onDirectionChange,
  onJump,
}: TouchControlsProps) {
  if (!visible) return null;

  const styles = touchControlsStyles();
  const release = () => onDirectionChange(0);
  const holdHandlers = (direction: WalkDirection) => ({
    onPointerDown: () => onDirectionChange(direction),
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
    onContextMenu: preventContextMenu,
  });

  return (
    <div className={styles.root()}>
      <button
        type="button"
        aria-label={TOUCH_LABELS.left}
        className={styles.button()}
        {...holdHandlers(-1)}
      >
        <ArrowLeftIcon className={styles.icon()} />
      </button>
      <button
        type="button"
        aria-label={TOUCH_LABELS.jump}
        className={styles.button()}
        onPointerDown={onJump}
        onContextMenu={preventContextMenu}
      >
        <ArrowUpIcon className={styles.icon()} />
      </button>
      <button
        type="button"
        aria-label={TOUCH_LABELS.right}
        className={styles.button()}
        {...holdHandlers(1)}
      >
        <ArrowRightIcon className={styles.icon()} />
      </button>
    </div>
  );
});
