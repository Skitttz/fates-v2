export const WALK_PHYSICS = {
  maxSpeed: 60,
  acceleration: 240,
  friction: 300,
  jumpVelocity: 170,
  gravity: 600,
  bodyWidth: 10,
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
  blocked: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const createWalkState = (x: number): WalkState => ({
  x,
  y: 0,
  vx: 0,
  vy: 0,
  airborne: false,
  blocked: false,
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
  let vx = accelerate(state.vx, input.direction, seconds);
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
  let blocked = (x === world.min && vx <= 0) || (x === world.max && vx >= 0);
  if (blocked) vx = 0;
  world.obstacles.forEach((obstacle) => {
    const reach = (WALK_PHYSICS.bodyWidth + obstacle.width) / 2;
    if (y >= obstacle.height) return;
    // Sweep to the near face, then keep contact until moving away or clearing it vertically.
    const left = obstacle.x - reach;
    const right = obstacle.x + reach;
    const crossed = (state.x <= left && x >= left) || (state.x >= right && x <= right);
    if (!crossed && (x < left || x > right)) return;
    const side = state.x < obstacle.x ? -1 : 1;
    x = clamp(obstacle.x + side * reach, world.min, world.max);
    vx = 0;
    blocked = true;
  });

  return { x, y, vx, vy, airborne, blocked };
}
