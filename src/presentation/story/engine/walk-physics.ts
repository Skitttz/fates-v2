export const WALK_PHYSICS = {
  maxSpeed: 60,
  acceleration: 240,
  friction: 300,
  jumpVelocity: 170,
  gravity: 600,
  bodyWidth: 10,
  bounce: 4,
  blockedMs: 300,
};

export const CONE_BOX = { width: 8, height: 12 };

export type WalkObstacle = { x: number; width: number; height: number };

export type WalkWorld = { min: number; max: number; obstacles: readonly WalkObstacle[] };

export type WalkInput = { direction: -1 | 0 | 1; jump: boolean };

export type WalkState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  airborne: boolean;
  blockedMs: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const createWalkState = (x: number): WalkState => ({
  x,
  y: 0,
  vx: 0,
  vy: 0,
  airborne: false,
  blockedMs: 0,
});

const accelerate = (vx: number, direction: number, seconds: number) => {
  const { acceleration, friction, maxSpeed } = WALK_PHYSICS;
  if (direction !== 0) return clamp(vx + direction * acceleration * seconds, -maxSpeed, maxSpeed);
  const slowdown = friction * seconds;
  return Math.abs(vx) <= slowdown ? 0 : vx - Math.sign(vx) * slowdown;
};

export function stepWalk(
  state: WalkState,
  input: WalkInput,
  dtMs: number,
  world: WalkWorld,
): WalkState {
  const seconds = dtMs / 1000;
  const blockedMs = Math.max(0, state.blockedMs - dtMs);
  const direction = blockedMs > 0 ? 0 : input.direction;
  let vx = accelerate(state.vx, direction, seconds);
  let { y, vy, airborne } = state;

  if (input.jump && !airborne) {
    vy = WALK_PHYSICS.jumpVelocity;
    airborne = true;
  }
  if (airborne) {
    y += vy * seconds;
    vy -= WALK_PHYSICS.gravity * seconds;
    if (y <= 0 && vy <= 0) {
      y = 0;
      vy = 0;
      airborne = false;
    }
  }

  let x = clamp(state.x + vx * seconds, world.min, world.max);
  let blocked = blockedMs;
  world.obstacles.forEach((obstacle) => {
    const reach = (WALK_PHYSICS.bodyWidth + obstacle.width) / 2;
    if (Math.abs(x - obstacle.x) >= reach || y >= obstacle.height) return;
    const side = state.x < obstacle.x ? -1 : 1;
    x = obstacle.x + side * (reach + WALK_PHYSICS.bounce);
    vx = 0;
    blocked = WALK_PHYSICS.blockedMs;
  });

  return { x, y, vx, vy, airborne, blockedMs: blocked };
}
