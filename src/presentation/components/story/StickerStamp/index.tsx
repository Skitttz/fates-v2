import Image from 'next/image';
import logo from '@/presentation/assets/logo.svg';
import { stickerStamp } from '@/presentation/story/engine/animations';
import { STICKER_STAMP_TEST_ID, STICKER_TILT_DEGREES } from './constants';
import { StickerStampProps } from './types';

export function StickerStamp({ progress }: StickerStampProps) {
  const { scale, opacity } = stickerStamp(progress);

  return (
    <div
      data-testid={STICKER_STAMP_TEST_ID}
      className="flex h-full w-full items-center justify-center"
      style={{ opacity }}
    >
      <div
        className="w-2/5 border-4 border-zinc-50 bg-black px-[4%] py-[3%] shadow-[6px_6px_0_rgba(0,0,0,0.6)]"
        style={{ transform: `rotate(${STICKER_TILT_DEGREES}deg) scale(${scale})` }}
      >
        <Image src={logo} alt="" className="h-auto w-full" />
      </div>
    </div>
  );
}
