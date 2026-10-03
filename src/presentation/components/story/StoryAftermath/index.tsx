'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StoryChoiceOptionModel } from '@/domain/models';
import { Button } from '@/presentation/components/ui';
import { AFTERMATH_MS, aftermathScene } from '@/presentation/story/engine/aftermath';
import { GameCanvas } from '../GameCanvas';
import { storyAftermathStyles } from './styles';

export function StoryAftermath({
  consequence,
  reducedMotion,
  onContinue,
}: {
  consequence: NonNullable<StoryChoiceOptionModel['consequence']>;
  reducedMotion: boolean;
  onContinue: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const styles = storyAftermathStyles();
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const scene = useMemo(
    () => aftermathScene(consequence.place, reducedMotion ? 1 : 0),
    [consequence.place, reducedMotion],
  );
  const getScene = useCallback(
    (time: number) => aftermathScene(consequence.place, reducedMotion ? 1 : time / AFTERMATH_MS),
    [consequence.place, reducedMotion],
  );
  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-label="Seu adesivo ganhou a rua"
      className={styles.root()}
    >
      <div className={styles.heading()}>
        <span className={styles.marker()} aria-hidden="true" />
        <p>Um adesivo. Outro começo.</p>
      </div>
      <GameCanvas scene={scene} getScene={getScene} animated={!reducedMotion} />
      <div className={styles.panel()}>
        <h2 className={styles.title()}>{consequence.title}</h2>
        <p className={styles.text()}>{consequence.text}</p>
      </div>
      <Button size="lg" onClick={onContinue} className={styles.action()}>
        Ver meu destino
      </Button>
    </section>
  );
}
