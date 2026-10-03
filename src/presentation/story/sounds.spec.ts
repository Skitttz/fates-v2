import { describe, expect, it } from 'vitest';
import { OLLIE_TIMELINE } from './engine/animations';
import { blipRate, musicFor, ollieSoundCues, shouldBlip, SOUNDS, transitionSound } from './sounds';

describe('story sounds', () => {
  it('uses one blip pitch per speaker', () => {
    expect(blipRate('paulo')).toBe(1);
    expect(blipRate('urso')).toBe(1.25);
    expect(blipRate(null)).toBe(0.9);
    expect(blipRate('desconhecido')).toBe(1);
  });

  it('blips every two typed letters', () => {
    expect([0, 1, 2, 3, 4].map(shouldBlip)).toEqual([false, false, true, false, true]);
  });

  it('picks the music and the transition sound for each world', () => {
    expect(musicFor('real')).toBe(SOUNDS.musicReal);
    expect(musicFor('dream')).toBe(SOUNDS.musicDream);
    expect(transitionSound('fade-to-dream')).toBe(SOUNDS.enterDream);
    expect(transitionSound('flash-to-real')).toBe(SOUNDS.wakeUp);
    expect(transitionSound('cut')).toBeNull();
  });

  it('follows the ollie timeline', () => {
    expect(ollieSoundCues('landed')).toEqual([
      { at: OLLIE_TIMELINE.air, sound: SOUNDS.landing },
      { at: OLLIE_TIMELINE.landedSlip, sound: SOUNDS.fall },
    ]);
    expect(ollieSoundCues('missed')).toEqual([
      { at: OLLIE_TIMELINE.missedSlip, sound: SOUNDS.fall },
    ]);
  });

  it('uses the file names agreed for the sound folder', () => {
    expect(Object.values(SOUNDS).sort()).toEqual(
      [
        'enter-dream',
        'fall',
        'landing',
        'menu-select',
        'music-dream',
        'music-real',
        'ollie',
        'skate-roll',
        'sticker-found',
        'sticker-place',
        'text-blip',
        'wake-up',
      ].sort(),
    );
  });
});
