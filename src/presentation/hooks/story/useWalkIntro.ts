'use client';

import { useCallback, useEffect, useState } from 'react';

export const WALK_INTRO_MS = 600;

type Intro = { key: string | null; timedOut: boolean; dismissed: boolean };

const startIntro = (key: string | null): Intro => ({ key, timedOut: false, dismissed: false });

export function useWalkIntro(walkKey: string | null, instant: boolean, steering: boolean) {
  const [intro, setIntro] = useState(() => startIntro(walkKey));
  const current = intro.key === walkKey ? intro : startIntro(walkKey);
  const released = walkKey !== null && (instant || current.timedOut);
  const dismissed = current.dismissed || (released && steering);

  if (intro.key !== walkKey || intro.dismissed !== dismissed) setIntro({ ...current, dismissed });

  useEffect(() => {
    if (!walkKey || instant) return;
    const timer = window.setTimeout(
      () => setIntro((state) => (state.key === walkKey ? { ...state, timedOut: true } : state)),
      WALK_INTRO_MS,
    );
    return () => window.clearTimeout(timer);
  }, [walkKey, instant]);

  const dismiss = useCallback(() => setIntro((state) => ({ ...state, dismissed: true })), []);

  return { released, visible: walkKey !== null && !dismissed, dismiss };
}
