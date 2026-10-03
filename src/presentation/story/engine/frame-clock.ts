export const MAX_FRAME_STEP_MS = 50;

export type FrameTick = { sceneTimeMs: number; dtMs: number };

export type FrameClock = { tick: (now: number, sceneId: string) => FrameTick };

export function createFrameClock(): FrameClock {
  let currentScene: string | null = null;
  let sceneStart = 0;
  let last: number | null = null;

  return {
    tick(now, sceneId) {
      if (sceneId !== currentScene) {
        currentScene = sceneId;
        sceneStart = now;
      }
      const dtMs = last === null ? 0 : Math.min(Math.max(now - last, 0), MAX_FRAME_STEP_MS);
      last = now;
      return { sceneTimeMs: now - sceneStart, dtMs };
    },
  };
}
