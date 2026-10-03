import { tv } from '@/presentation/styles/tv';

export const storyToolbarStyles = tv({
  slots: {
    root: 'flex flex-wrap justify-end gap-2',
    action: 'min-h-12',
    sound: 'min-h-12',
    soundIcon: 'size-4',
  },
  variants: {
    soundOn: {
      true: {
        sound: 'border-2 border-street-lime text-street-lime',
        soundIcon: 'motion-safe:animate-pulse',
      },
    },
  },
});
