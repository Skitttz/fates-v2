'use client';

import { useEffect, useRef, useState } from 'react';

export const WALK_SPEED = 60;
export const WALK_MAX_STEP_MS = 50;
export const WALK_ARRIVAL_DISTANCE = 4;
export const WALK_BOUNDS = { min: 8, max: 232 };

export type WalkDirection = -1 | 0 | 1;

type UseWalkParams = {
  active: boolean;
  startX: number;
  targetX: number;
  direction: WalkDirection;
  onArrive: () => void;
};

export function useWalk({ active, startX, targetX, direction, onArrive }: UseWalkParams): number {
  const [x, setX] = useState(startX);
  const directionRef = useRef(direction);
  const onArriveRef = useRef(onArrive);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    onArriveRef.current = onArrive;
  }, [onArrive]);

  useEffect(() => {
    setX(startX);
    if (!active) return;

    let frame = 0;
    let last = performance.now();
    let current = startX;
    const target = Math.min(WALK_BOUNDS.max, Math.max(WALK_BOUNDS.min, targetX));

    const step = (now: number) => {
      const delta = Math.min(Math.max(now - last, 0), WALK_MAX_STEP_MS);
      last = now;
      current = Math.min(
        WALK_BOUNDS.max,
        Math.max(WALK_BOUNDS.min, current + directionRef.current * WALK_SPEED * (delta / 1000)),
      );
      setX(current);

      if (Math.abs(current - target) <= WALK_ARRIVAL_DISTANCE) {
        onArriveRef.current();
        return;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, startX, targetX]);

  return x;
}
