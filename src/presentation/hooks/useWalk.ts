'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CONE_BOX,
  createWalkState,
  stepWalk,
  WalkState,
} from '@/presentation/story/engine/walk-physics';

export const WALK_MAX_STEP_MS = 50;
export const WALK_ARRIVAL_DISTANCE = 4;
export const WALK_BOUNDS = { min: 8, max: 232 };

export type WalkDirection = -1 | 0 | 1;

type UseWalkParams = {
  active: boolean;
  startX: number;
  targetX: number;
  direction: WalkDirection;
  obstacles?: readonly { x: number }[];
  onArrive: () => void;
  onJump?: () => void;
  onLand?: () => void;
};

export type WalkView = {
  x: number;
  y: number;
  airborne: boolean;
  rising: boolean;
  jump: () => void;
};

const view = (state: WalkState) => ({
  x: state.x,
  y: state.y,
  airborne: state.airborne,
  rising: state.vy > 0,
});

export function useWalk({
  active,
  startX,
  targetX,
  direction,
  obstacles = [],
  onArrive,
  onJump,
  onLand,
}: UseWalkParams): WalkView {
  const [walk, setWalk] = useState(() => view(createWalkState(startX)));
  const directionRef = useRef(direction);
  const jumpRef = useRef(false);
  const callbacksRef = useRef({ onArrive, onJump, onLand });
  const obstaclesKey = obstacles.map(({ x }) => x).join(',');

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    callbacksRef.current = { onArrive, onJump, onLand };
  }, [onArrive, onJump, onLand]);

  const jump = useCallback(() => {
    jumpRef.current = true;
  }, []);

  useEffect(() => {
    let state = createWalkState(startX);
    setWalk(view(state));
    jumpRef.current = false;
    if (!active) return;

    const world = {
      ...WALK_BOUNDS,
      obstacles: obstaclesKey
        ? obstaclesKey.split(',').map((x) => ({ x: Number(x), ...CONE_BOX }))
        : [],
    };
    const target = Math.min(WALK_BOUNDS.max, Math.max(WALK_BOUNDS.min, targetX));
    let frame = 0;
    let last: number | null = null;

    const step = (now: number) => {
      const delta = last === null ? 0 : Math.min(Math.max(now - last, 0), WALK_MAX_STEP_MS);
      last = now;
      const wantsJump = jumpRef.current;
      jumpRef.current = false;
      const next = stepWalk(
        state,
        { direction: directionRef.current, jump: wantsJump },
        delta,
        world,
      );
      if (!state.airborne && next.airborne) callbacksRef.current.onJump?.();
      if (state.airborne && !next.airborne) callbacksRef.current.onLand?.();
      state = next;
      setWalk(view(state));

      if (Math.abs(state.x - target) <= WALK_ARRIVAL_DISTANCE) {
        callbacksRef.current.onArrive();
        return;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, startX, targetX, obstaclesKey]);

  return { ...walk, jump };
}
