import Image from 'next/image';
import logo from '@/presentation/assets/logo.svg';
import { stickerStamp } from '@/presentation/story/engine/animations';
import { STICKER_STAMP_TEST_ID, STICKER_TILT_DEGREES } from './constants';
import { stickerStampStyles } from './styles';
import { StickerStampProps } from './types';

export function StickerStamp({ progress }: StickerStampProps) {
  const { scale, opacity } = stickerStamp(progress);
  const styles = stickerStampStyles();
  const rootStyle = { opacity };
  const stickerStyle = { transform: `rotate(${STICKER_TILT_DEGREES}deg) scale(${scale})` };

  return (
    <div data-testid={STICKER_STAMP_TEST_ID} className={styles.root()} style={rootStyle}>
      <div className={styles.sticker()} style={stickerStyle}>
        <Image src={logo} alt="" className={styles.logo()} />
      </div>
    </div>
  );
}
