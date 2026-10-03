'use client';

import { ReactNode, useState } from 'react';
import { SoundProvider } from '@/presentation/contexts/sound';
import { makeSoundPlayer, makeSoundPreference } from '../../audio';

export function AboutSoundFactory({ children }: { children: ReactNode }) {
  const [player] = useState(makeSoundPlayer);
  const [preference] = useState(makeSoundPreference);
  return (
    <SoundProvider player={player} preference={preference}>
      {children}
    </SoundProvider>
  );
}
