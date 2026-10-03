import { CONE_BOX, createWalkState, stepWalk, WalkInput, WalkState } from './walk-physics';

export const WALK_STEP_MS = 1000 / 60;
export const WALK_MAX_STEP_MS = 50;
export const WALK_ARRIVAL_DISTANCE = 4;
export const WALK_BOUNDS = { min: 8, max: 232 };
export const JUMP_BUFFER_MS = 120;
const JUMP_PREPARATION_MS = 50;
const JUMP_POP_MS = 100;
const LANDING_MS = 140;
const IMPACT_MS = 100;
export type JumpPhase = 'grounded' | 'crouch' | 'pop' | 'air' | 'falling' | 'landing';
export type WalkSnapshot = WalkState & {
  facing: -1 | 1;
  bumps: number;
  jumpPhase: JumpPhase;
  impactMs: number;
};
export type WalkEvent = 'jump' | 'land' | 'bump' | 'arrive';
export type WalkConfig = { startX: number; targetX: number; obstacles?: readonly { x: number }[] };
export const isRolling = (state: WalkSnapshot): boolean =>
  !state.airborne && !state.blocked && Math.abs(state.vx) > 0.1;

const jumpPhaseFor = (
  state: WalkState,
  airborneMs: number,
  preparingMs: number,
  landingMs: number,
): JumpPhase => {
  if (state.airborne && airborneMs < JUMP_POP_MS) return 'pop';
  if (state.airborne) return state.vy < -60 ? 'falling' : 'air';
  if (preparingMs > 0) return 'crouch';
  return landingMs > 0 ? 'landing' : 'grounded';
};

/** Position and the simulation clock live outside React; only discrete events reach the UI. */
export function createWalkRuntime({ startX, targetX, obstacles = [] }: WalkConfig) {
  let state: WalkSnapshot = {
    ...createWalkState(startX),
    facing: 1,
    bumps: 0,
    jumpPhase: 'grounded',
    impactMs: 0,
  };
  let direction: WalkInput['direction'] = 0;
  let accumulator = 0;
  let bufferedJump = 0;
  let preparingMs = 0;
  let airborneMs = 0;
  let landingMs = 0;
  let arrived = false;
  const world = { ...WALK_BOUNDS, obstacles: obstacles.map(({ x }) => ({ x, ...CONE_BOX })) };
  const target = Math.min(WALK_BOUNDS.max, Math.max(WALK_BOUNDS.min, targetX));
  return {
    getSnapshot: () => state,
    setDirection: (value: WalkInput['direction']) => {
      direction = value;
    },
    jump: () => {
      if (preparingMs === 0) bufferedJump = JUMP_BUFFER_MS;
    },
    stop: () => {
      direction = 0;
      bufferedJump = 0;
      preparingMs = 0;
      accumulator = 0;
      state = {
        ...state,
        vx: 0,
        jumpPhase: state.jumpPhase === 'crouch' ? 'grounded' : state.jumpPhase,
      };
    },
    advance(dtMs: number): WalkEvent[] {
      if (arrived) return [];
      const events: WalkEvent[] = [];
      accumulator += Math.min(Math.max(dtMs, 0), WALK_MAX_STEP_MS);
      while (accumulator + 1e-6 >= WALK_STEP_MS) {
        if (bufferedJump > 0 && !state.airborne && preparingMs === 0) {
          preparingMs = JUMP_PREPARATION_MS;
          bufferedJump = 0;
        }
        const launch = preparingMs > 0 && preparingMs <= WALK_STEP_MS + 1e-6;
        const next = stepWalk(state, { direction, jump: launch }, WALK_STEP_MS, world);
        preparingMs = Math.max(0, preparingMs - WALK_STEP_MS);
        bufferedJump = Math.max(0, bufferedJump - WALK_STEP_MS);
        if (!state.airborne && next.airborne) events.push('jump');
        const landed = state.airborne && !next.airborne;
        if (landed) events.push('land');
        const bumped = next.blocked && !state.blocked;
        if (bumped) events.push('bump');
        airborneMs = next.airborne && state.airborne ? airborneMs + WALK_STEP_MS : 0;
        landingMs = landed ? LANDING_MS : Math.max(0, landingMs - WALK_STEP_MS);
        const jumpPhase = jumpPhaseFor(next, airborneMs, preparingMs, landingMs);
        state = {
          ...next,
          facing: next.vx === 0 ? state.facing : (Math.sign(next.vx) as -1 | 1),
          bumps: state.bumps + Number(bumped),
          jumpPhase,
          impactMs: bumped ? IMPACT_MS : Math.max(0, state.impactMs - WALK_STEP_MS),
        };
        accumulator -= WALK_STEP_MS;
        if (
          Math.abs(state.x - target) <= WALK_ARRIVAL_DISTANCE &&
          !state.airborne &&
          preparingMs === 0
        )
          break;
      }
      if (
        Math.abs(state.x - target) <= WALK_ARRIVAL_DISTANCE &&
        !state.airborne &&
        preparingMs === 0
      ) {
        arrived = true;
        state = { ...state, vx: 0 };
        events.push('arrive');
      }
      return events;
    },
  };
}
