'use client';

import { useEffect, useRef, useState } from 'react';
import { computeCanvasScale } from '@/presentation/story/engine/canvas-scale';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/presentation/story/engine/constants';
import { renderScene } from '@/presentation/story/engine/renderer';
import { SPRITE_SHEETS } from '@/presentation/story/sprites';
import { createBrowserCanvas, createSpriteCache } from '@/presentation/story/sprites/sprite-cache';
import { GameCanvasProps } from './types';

export function GameCanvas(props: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === 'undefined') return;
    const update = () => setScale(computeCanvasScale(wrapper.clientWidth, window.innerHeight));
    const observer = new ResizeObserver(update);
    observer.observe(wrapper);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const sprites = createSpriteCache(SPRITE_SHEETS, createBrowserCanvas);
    let frame = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;

    const draw = (now: number) => {
      renderScene(context, { ...propsRef.current, timeMs: now }, sprites);
      frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      if (onScreen && pageVisible) frame = requestAnimationFrame(draw);
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            schedule();
          });
    observer?.observe(canvas);

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      schedule();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="flex w-full justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-hidden="true"
        className="block h-auto [image-rendering:pixelated]"
        style={{ width: scale ? CANVAS_WIDTH * scale : '100%' }}
      />
    </div>
  );
}
