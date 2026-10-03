import { tv } from '@/presentation/styles/tv';

export const storyGameSkeletonStyles = tv({
  slots: {
    root: 'flex flex-col gap-3',
    toolbar: 'ml-auto h-9 w-40',
    canvas: 'aspect-video w-full',
    dialogue: 'h-28 w-full',
  },
});
