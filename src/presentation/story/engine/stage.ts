import { SpriteCache } from '../sprites/sprite-cache';
import { createFrameClock } from './frame-clock';
import { emitParticles, Random, updateParticles } from './particles';
import { renderScene } from './renderer';
import { Particle, RenderInput } from './types';

export type StageInput = Omit<RenderInput, 'timeMs' | 'sceneTimeMs' | 'particles'> & {
  getWalkFrame?: () => RenderInput['walk'];
  getScene?: (sceneTimeMs: number) => RenderInput['scene'];
};

export type FrameScheduler = {
  request: (callback: FrameRequestCallback) => number;
  cancel: (id: number) => void;
};

export type StageOptions = { random?: Random; scheduler?: FrameScheduler };

const browserScheduler: FrameScheduler = {
  request: (callback) => requestAnimationFrame(callback),
  cancel: (id) => cancelAnimationFrame(id),
};

export class StoryStage {
  private readonly clock = createFrameClock();
  private readonly random: Random;
  private readonly scheduler: FrameScheduler;
  private particles: Particle[] = [];
  private previous: RenderInput | null = null;
  private frame: number | null = null;
  private active = false;

  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly sprites: SpriteCache,
    private input: StageInput,
    options: StageOptions = {},
  ) {
    this.random = options.random ?? Math.random;
    this.scheduler = options.scheduler ?? browserScheduler;
  }

  update(input: StageInput): void {
    this.input = input;
  }

  start(): void {
    this.active = true;
    this.schedule();
  }

  stop(): void {
    this.active = false;
    if (this.frame !== null) this.scheduler.cancel(this.frame);
    this.frame = null;
  }

  dispose(): void {
    this.stop();
    this.particles = [];
    this.previous = null;
  }

  private schedule(): void {
    if (!this.active || this.frame !== null) return;
    this.frame = this.scheduler.request(this.draw);
  }

  private readonly draw = (now: number): void => {
    this.frame = null;
    const { sceneTimeMs, dtMs } = this.clock.tick(now, this.input.scene.id);
    const input: RenderInput = {
      ...this.input,
      scene: this.input.getScene?.(sceneTimeMs) ?? this.input.scene,
      walk: this.input.getWalkFrame?.() ?? this.input.walk,
      timeMs: now,
      sceneTimeMs,
    };
    this.particles = this.nextParticles(input, dtMs);
    renderScene(this.context, { ...input, particles: this.particles }, this.sprites);
    this.previous = input;
    this.schedule();
  };

  private nextParticles(input: RenderInput, dtMs: number): Particle[] {
    if (!input.animated) return [];
    const spawned = emitParticles(input, this.previous, dtMs, this.random);
    return updateParticles([...this.particles, ...spawned], dtMs);
  }
}
