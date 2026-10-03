import { tv } from '@/presentation/styles/tv';

export const stickerStampStyles = tv({
  slots: {
    root: 'flex h-full w-full items-center justify-center',
    sticker:
      'w-2/5 border-4 border-zinc-50 bg-black px-[4%] py-[3%] shadow-[6px_6px_0_rgba(0,0,0,0.6)]',
    logo: 'h-auto w-full',
  },
});
