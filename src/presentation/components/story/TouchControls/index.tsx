'use client';

import { MouseEvent } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { WalkDirection } from '@/presentation/hooks/useWalk';
import { TOUCH_BUTTON_CLASS, TOUCH_LABELS } from './constants';
import { TouchControlsProps } from './types';

export function TouchControls({ visible, onDirectionChange }: TouchControlsProps) {
  if (!visible) return null;

  const handlers = (direction: WalkDirection) => ({
    onPointerDown: () => onDirectionChange(direction),
    onPointerUp: () => onDirectionChange(0),
    onPointerLeave: () => onDirectionChange(0),
    onPointerCancel: () => onDirectionChange(0),
    onContextMenu: (event: MouseEvent) => event.preventDefault(),
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        aria-label={TOUCH_LABELS.left}
        className={TOUCH_BUTTON_CLASS}
        {...handlers(-1)}
      >
        <ArrowLeftIcon className="size-7" />
      </button>
      <span className="font-pixel text-sm text-zinc-400">{TOUCH_LABELS.hint}</span>
      <button
        type="button"
        aria-label={TOUCH_LABELS.right}
        className={TOUCH_BUTTON_CLASS}
        {...handlers(1)}
      >
        <ArrowRightIcon className="size-7" />
      </button>
    </div>
  );
}
