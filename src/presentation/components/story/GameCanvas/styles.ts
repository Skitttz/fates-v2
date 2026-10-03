import { tv } from '@/presentation/styles/tv';

export const gameCanvasStyles = tv({
  slots: {
    root: 'flex w-full justify-center bg-black',
    stage: 'relative',
    underlay: 'absolute inset-0',
    canvas: 'relative block h-auto w-full [image-rendering:pixelated]',
    overlay: 'pointer-events-none absolute inset-0',
  },
});
