import { describe, expect, it } from 'vitest';
import {
  CONE_BOX,
  createWalkState,
  stepWalk,
  WALK_PHYSICS,
  WalkInput,
  WalkState,
} from './walk-physics';

const world = { min: 8, max: 232, obstacles: [] as { x: number; width: number; height: number }[] };

const run = (state: WalkState, input: WalkInput, frames: number, worldOverride = world) => {
  let current = state;
  for (let frame = 0; frame < frames; frame += 1) {
    current = stepWalk(current, frame === 0 ? input : { ...input, jump: false }, 16, worldOverride);
  }
  return current;
};

describe('stepWalk', () => {
  it('accelerates up to the max speed and brakes smoothly', () => {
    const first = stepWalk(createWalkState(20), { direction: 1, jump: false }, 16, world);
    expect(first.vx).toBeGreaterThan(0);
    expect(first.vx).toBeLessThan(WALK_PHYSICS.maxSpeed);

    const running = run(createWalkState(20), { direction: 1, jump: false }, 40);
    expect(running.vx).toBe(WALK_PHYSICS.maxSpeed);

    const braking = stepWalk(running, { direction: 0, jump: false }, 16, world);
    expect(braking.vx).toBeGreaterThan(0);
    expect(run(running, { direction: 0, jump: false }, 30).vx).toBe(0);
  });

  it('jumps in an arc and lands back on the ground', () => {
    const takeOff = stepWalk(createWalkState(20), { direction: 0, jump: true }, 16, world);
    expect(takeOff.airborne).toBe(true);
    const peak = run(takeOff, { direction: 0, jump: false }, 15);
    expect(peak.y).toBeGreaterThan(20);
    const landed = run(takeOff, { direction: 0, jump: false }, 60);
    expect(landed).toMatchObject({ y: 0, airborne: false, vy: 0 });
  });

  it('keeps a jump requested on a zero length step', () => {
    const takeOff = stepWalk(createWalkState(20), { direction: 0, jump: true }, 0, world);

    expect(takeOff).toMatchObject({ airborne: true, vy: WALK_PHYSICS.jumpVelocity });
  });

  it('does not jump again while in the air', () => {
    const takeOff = stepWalk(createWalkState(20), { direction: 0, jump: true }, 16, world);
    const again = stepWalk(takeOff, { direction: 0, jump: true }, 16, world);

    expect(again.vy).toBeLessThan(takeOff.vy);
  });

  it('bumps back from the cone when walking into it', () => {
    const cone = { x: 84, ...CONE_BOX };
    const blocked = run(createWalkState(60), { direction: 1, jump: false }, 120, {
      ...world,
      obstacles: [cone],
    });

    expect(blocked.x).toBeLessThan(cone.x - (WALK_PHYSICS.bodyWidth + cone.width) / 2);
  });

  it('clears the cone with a jump at full speed', () => {
    const cone = { x: 84, ...CONE_BOX };
    const coneWorld = { ...world, obstacles: [cone] };
    const running = run(createWalkState(30), { direction: 1, jump: false }, 40, coneWorld);
    const jumped = run(running, { direction: 1, jump: true }, 80, coneWorld);

    expect(running.x).toBeLessThan(cone.x - (WALK_PHYSICS.bodyWidth + cone.width) / 2);
    expect(jumped.x).toBeGreaterThan(cone.x + (WALK_PHYSICS.bodyWidth + cone.width) / 2);
  });
});
