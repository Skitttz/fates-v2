import { describe, expect, it } from 'vitest';
import { createWalkRuntime, isRolling, WALK_STEP_MS } from './walk-runtime';
import { walkActor } from './animations';

const paulo = { id: 'paulo', x: 20, y: 112, pose: 'skate' };
const renderedActor = (runtime: ReturnType<typeof createWalkRuntime>) =>
  walkActor(paulo, { actor: paulo.id, groundY: paulo.y, state: runtime.getSnapshot() });

const simulateJump = (fps: number) => {
  const runtime = createWalkRuntime({ startX: 20, targetX: 220 });
  runtime.setDirection(1);
  runtime.jump();
  let peak = 0;
  const events: string[] = [];
  for (let frame = 0; frame < fps; frame++) {
    events.push(...runtime.advance(1000 / fps));
    peak = Math.max(peak, runtime.getSnapshot().y);
  }
  return { state: runtime.getSnapshot(), peak, events };
};

describe('fixed-step walk runtime', () => {
  it.each([20, 30, 60, 120, 144])('keeps the same trajectory at %i FPS', (fps) => {
    const reference = simulateJump(60);
    const actual = simulateJump(fps);
    expect(actual.state).toEqual(reference.state);
    // Lower display rates may miss the exact apex, but by less than one rendered pixel.
    expect(Math.abs(actual.peak - reference.peak)).toBeLessThan(0.5);
    expect(actual.events).toEqual(['jump', 'land']);
  });

  it('caps a delayed frame and emits arrival only once', () => {
    const runtime = createWalkRuntime({ startX: 20, targetX: 26 });
    runtime.setDirection(1);
    runtime.advance(5000);
    expect(runtime.getSnapshot().x).toBeLessThan(22);
    const events = Array.from({ length: 120 }, () => runtime.advance(WALK_STEP_MS)).flat();
    expect(events.filter((event) => event === 'arrive')).toHaveLength(1);
    expect(isRolling(runtime.getSnapshot())).toBe(false);
  });

  it('buffers a jump just before landing, but does not double-jump', () => {
    const runtime = createWalkRuntime({ startX: 20, targetX: 220 });
    runtime.jump();
    const events: string[] = [];
    for (let i = 0; i < 32; i++) events.push(...runtime.advance(WALK_STEP_MS));
    expect(runtime.getSnapshot().airborne).toBe(true);
    runtime.jump();
    runtime.advance(WALK_STEP_MS);
    expect(runtime.getSnapshot().vy).toBeLessThan(0);
    for (let i = 0; i < 50; i++) events.push(...runtime.advance(WALK_STEP_MS));
    expect(events.filter((event) => event === 'jump')).toHaveLength(2);
  });

  it('expires an early jump request and clears controls without resetting position', () => {
    const runtime = createWalkRuntime({ startX: 20, targetX: 220 });
    runtime.setDirection(1);
    runtime.jump();
    runtime.advance(50);
    runtime.jump();
    const events = Array.from({ length: 50 }, () => runtime.advance(WALK_STEP_MS)).flat();
    expect(events.filter((event) => event === 'jump')).toHaveLength(0);
    const x = runtime.getSnapshot().x;
    runtime.jump();
    runtime.stop();
    runtime.advance(50);
    expect(runtime.getSnapshot()).toMatchObject({ x, vx: 0, airborne: false });
  });

  it('reports collisions and stops rolling while blocked or airborne', () => {
    const runtime = createWalkRuntime({ startX: 60, targetX: 150, obstacles: [{ x: 84 }] });
    runtime.setDirection(1);
    const events: string[] = [];
    for (let i = 0; i < 120; i++) events.push(...runtime.advance(WALK_STEP_MS));
    expect(runtime.getSnapshot()).toMatchObject({ bumps: 1, vx: 0 });
    expect(isRolling(runtime.getSnapshot())).toBe(false);
    const stopped = runtime.getSnapshot();
    for (let i = 0; i < 300; i++) {
      events.push(...runtime.advance(WALK_STEP_MS));
      expect(runtime.getSnapshot()).toEqual(stopped);
      expect(renderedActor(runtime).pose).toBe('skate');
    }
    expect(events).toEqual(['bump']);
    runtime.setDirection(0);
    runtime.advance(50);
    runtime.setDirection(1);
    expect(runtime.advance(50)).toEqual([]);
    runtime.jump();
    runtime.advance(50);
    expect(runtime.getSnapshot().airborne).toBe(true);
    expect(isRolling(runtime.getSnapshot())).toBe(false);
    for (let i = 0; i < 45; i++) runtime.advance(WALK_STEP_MS);
    expect(runtime.getSnapshot().x).toBeGreaterThan(93);
    expect(runtime.getSnapshot().bumps).toBe(1);
  });

  it('shows preparation, pop, tucked flight, descent and a grounded landing before riding again', () => {
    const runtime = createWalkRuntime({ startX: 20, targetX: 220 });
    runtime.jump();
    const phases: string[] = [];
    const events: string[] = [];
    for (let i = 0; i < 60; i++) {
      events.push(...runtime.advance(WALK_STEP_MS));
      const { jumpPhase, airborne, y } = runtime.getSnapshot();
      if (phases.at(-1) !== jumpPhase) phases.push(jumpPhase);
      if (jumpPhase === 'crouch' || jumpPhase === 'landing') {
        expect(airborne).toBe(false);
        expect(y).toBe(0);
        expect(renderedActor(runtime).pose).toBe('agachado');
      }
      if (jumpPhase === 'falling') expect(renderedActor(runtime).pose).toBe('ollie-descida');
    }
    expect(phases).toEqual(['crouch', 'pop', 'air', 'falling', 'landing', 'grounded']);
    expect(events).toEqual(['jump', 'land']);
  });

  it('cancels a prepared jump when focus leaves the game', () => {
    const runtime = createWalkRuntime({ startX: 20, targetX: 220 });
    runtime.jump();
    runtime.advance(WALK_STEP_MS);
    runtime.stop();
    const events = Array.from({ length: 60 }, () => runtime.advance(WALK_STEP_MS)).flat();
    expect(events).toEqual([]);
    expect(runtime.getSnapshot()).toMatchObject({ y: 0, jumpPhase: 'grounded' });
  });
});
