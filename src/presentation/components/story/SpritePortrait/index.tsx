'use client';

import { useEffect, useRef } from 'react';
import { SPRITE_SHEETS } from '@/presentation/story/sprites';
import { drawPixels } from '@/presentation/story/sprites/sprite-cache';
import { PORTRAIT_POSES, PORTRAIT_ROWS, PORTRAIT_SIZE } from './constants';
import { SpritePortraitProps } from './types';

export function SpritePortrait({ actor }: SpritePortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    const definition = SPRITE_SHEETS[actor]?.[PORTRAIT_POSES[actor] ?? ''];
    if (!context || !definition) return;
    context.clearRect(0, 0, PORTRAIT_SIZE, PORTRAIT_SIZE);
    drawPixels(context, definition.frames[0].slice(0, PORTRAIT_ROWS), definition.palette);
  }, [actor]);

  return (
    <canvas
      ref={canvasRef}
      width={PORTRAIT_SIZE}
      height={PORTRAIT_SIZE}
      aria-hidden="true"
      className="size-8 border-2 border-zinc-50 bg-zinc-800 [image-rendering:pixelated]"
    />
  );
}
