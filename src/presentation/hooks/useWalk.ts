'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createWalkRuntime, isRolling, WalkConfig } from '@/presentation/story/engine/walk-runtime';

export {
  WALK_MAX_STEP_MS,
  WALK_ARRIVAL_DISTANCE,
  WALK_BOUNDS,
} from '@/presentation/story/engine/walk-runtime';
export type WalkDirection = -1 | 0 | 1;

type UseWalkParams = WalkConfig & {
  active: boolean;
  direction: WalkDirection;
  resetKey?: unknown;
  onArrive: () => void;
  onJump?: () => void;
  onLand?: () => void;
  onBump?: () => void;
};

export function useWalk({
  active,
  startX,
  targetX,
  obstacles = [],
  direction,
  resetKey,
  onArrive,
  onJump,
  onLand,
  onBump,
}: UseWalkParams) {
  const obstaclesKey = obstacles.map(({ x }) => x).join(',');
  const runtime = useMemo(
    () =>
      createWalkRuntime({
        startX,
        targetX,
        obstacles: obstaclesKey ? obstaclesKey.split(',').map((x) => ({ x: Number(x) })) : [],
      }),
    // A replay is a new simulation even when its geometry is identical.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startX, targetX, obstaclesKey, resetKey],
  );
  const callbacks = useRef({ onArrive, onJump, onLand, onBump });
  const [feedback, setFeedback] = useState({ rolling: false, bumps: 0 });
  const feedbackRef = useRef(feedback);

  useEffect(() => {
    callbacks.current = { onArrive, onJump, onLand, onBump };
  }, [onArrive, onJump, onLand, onBump]);
  useEffect(() => {
    runtime.setDirection(active ? direction : 0);
  }, [active, direction, runtime]);

  useEffect(() => {
    const publish = () => {
      const state = runtime.getSnapshot();
      const rolling = active && isRolling(state);
      if (feedbackRef.current.rolling === rolling && feedbackRef.current.bumps === state.bumps)
        return;
      feedbackRef.current = { rolling, bumps: state.bumps };
      setFeedback(feedbackRef.current);
    };
    if (!active) {
      runtime.stop();
      publish();
      return;
    }
    let frame = 0;
    let last: number | null = null;
    const step = (now: number) => {
      const events = runtime.advance(last === null ? 0 : now - last);
      last = now;
      publish();
      events.forEach((event) => {
        if (event === 'jump') callbacks.current.onJump?.();
        if (event === 'land') callbacks.current.onLand?.();
        if (event === 'bump') callbacks.current.onBump?.();
        if (event === 'arrive') callbacks.current.onArrive();
      });
      if (!events.includes('arrive')) frame = requestAnimationFrame(step);
    };
    publish();
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      runtime.stop();
    };
  }, [active, runtime]);

  const jump = useCallback(() => {
    // The controller gates input. A touch that restores focus can queue the next step.
    runtime.jump();
  }, [runtime]);
  return { ...feedback, getSnapshot: runtime.getSnapshot, jump };
}
