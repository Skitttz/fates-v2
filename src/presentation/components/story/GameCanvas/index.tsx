'use client';

import { useEffect, useRef } from 'react';
import { useCanvasScale } from '@/presentation/hooks/story';
import { canvasWidth } from '@/presentation/story/engine/canvas-scale';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/presentation/story/engine/constants';
import { StoryStage } from '@/presentation/story/engine/stage';
import { watchVisibility } from '@/presentation/story/engine/visibility';
import { SPRITE_SHEETS } from '@/presentation/story/sprites';
import { createBrowserCanvas, createSpriteCache } from '@/presentation/story/sprites/sprite-cache';
import { gameCanvasStyles } from './styles';
import { GameCanvasProps } from './types';

export function GameCanvas({ underlay, overlay, ...input }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(input);
  const stageRef = useRef<StoryStage | null>(null);
  const scale = useCanvasScale(wrapperRef);
  const stageStyle = { width: canvasWidth(scale) };
  const styles = gameCanvasStyles();

  useEffect(() => {
    inputRef.current = input;
    stageRef.current?.update(input);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const sprites = createSpriteCache(SPRITE_SHEETS, createBrowserCanvas);
    const stage = new StoryStage(context, sprites, inputRef.current);
    stageRef.current = stage;
    const release = watchVisibility(canvas, (visible) => {
      if (visible) stage.start();
      else stage.stop();
    });

    return () => {
      release();
      stage.dispose();
      stageRef.current = null;
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.root()}>
      <div className={styles.stage()} style={stageStyle}>
        {underlay && (
          <div aria-hidden="true" className={styles.underlay()}>
            {underlay}
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-hidden="true"
          className={styles.canvas()}
        />
        {overlay && (
          <div aria-hidden="true" className={styles.overlay()}>
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
}
