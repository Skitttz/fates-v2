import { StoryTransition, StoryWorld } from '@/domain/models';
import { OLLIE_TIMELINE } from './engine/animations';
import { OllieResult } from './engine/story-reducer';

export const SOUNDS = {
  musicReal: 'music-real',
  musicDream: 'music-dream',
  ollie: 'ollie',
  landing: 'landing',
  fall: 'fall',
  skateRoll: 'skate-roll',
  textBlip: 'text-blip',
  enterDream: 'enter-dream',
  wakeUp: 'wake-up',
  stickerFound: 'sticker-found',
  stickerPlace: 'sticker-place',
  menuSelect: 'menu-select',
} as const;

const MUSICS: readonly string[] = [SOUNDS.musicReal, SOUNDS.musicDream];

export const EFFECT_SOUNDS: readonly string[] = Object.values(SOUNDS).filter(
  (id) => !MUSICS.includes(id),
);

export const BLIP_EVERY_CHARS = 2;
export const BLIP_VOLUME = 0.18;
const BLIP_RATES: Readonly<Record<string, number>> = { paulo: 1, urso: 1.25 };
const NARRATION_BLIP_RATE = 0.9;
const DEFAULT_BLIP_RATE = 1;

export const blipRate = (speaker: string | null): number =>
  speaker ? (BLIP_RATES[speaker] ?? DEFAULT_BLIP_RATE) : NARRATION_BLIP_RATE;

export const shouldBlip = (typedCount: number): boolean =>
  typedCount > 0 && typedCount % BLIP_EVERY_CHARS === 0;

export const musicFor = (world: StoryWorld): string =>
  world === 'dream' ? SOUNDS.musicDream : SOUNDS.musicReal;

export const transitionSound = (kind?: StoryTransition): string | null => {
  if (kind === 'fade-to-dream') return SOUNDS.enterDream;
  if (kind === 'flash-to-real') return SOUNDS.wakeUp;
  return null;
};

export const ollieSoundCues = (result: OllieResult): { at: number; sound: string }[] =>
  result === 'landed'
    ? [
        { at: OLLIE_TIMELINE.air, sound: SOUNDS.landing },
        { at: OLLIE_TIMELINE.landedSlip, sound: SOUNDS.fall },
      ]
    : [{ at: OLLIE_TIMELINE.missedSlip, sound: SOUNDS.fall }];
