'use client';

import { ReactNode, useState } from 'react';
import { SoundProvider } from '@/presentation/contexts/sound';
import { makeSoundPlayer } from '../../audio';

export function AboutSoundFactory({ children }: { children: ReactNode }) {
  const [player] = useState(makeSoundPlayer);
  return <SoundProvider player={player}>{children}</SoundProvider>;
}
