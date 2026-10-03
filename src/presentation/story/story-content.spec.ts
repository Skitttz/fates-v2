import { describe, expect, it } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { describeBackdrop } from './backdrop-descriptions';
import { meterValueAt, OLLIE_CYCLE_MS, ollieResultFor } from './engine/ollie';
import { DEFAULT_STORY_PHOTO, photoForChoice, resolveStoryPhoto, STORY_PHOTOS } from './photos';
import { getSpeakerName } from './speakers';

describe('story content', () => {
  it('names the speakers and keeps narration without name', () => {
    expect(getSpeakerName('paulo')).toBe('Paulo');
    expect(getSpeakerName('urso')).toBe('Ursinho');
    expect(getSpeakerName(null)).toBeNull();
    expect(getSpeakerName('vizinho')).toBe('vizinho');
  });

  it('falls back to the default photo for unknown or missing ids', () => {
    expect(resolveStoryPhoto('poste')).toBe(STORY_PHOTOS.poste);
    expect(resolveStoryPhoto('lua')).toBe(STORY_PHOTOS[DEFAULT_STORY_PHOTO]);
    expect(resolveStoryPhoto(null)).toBe(STORY_PHOTOS[DEFAULT_STORY_PHOTO]);
  });

  it('finds the photo of the chosen option', () => {
    expect(photoForChoice(mockStoryModel(), 'poste')).toBe('poste');
    expect(photoForChoice(mockStoryModel(), null)).toBeNull();
  });

  it('describes known backdrops and returns empty for unknown ones', () => {
    expect(describeBackdrop('sonho')).toContain('sonho');
    expect(describeBackdrop('lua')).toBe('');
  });

  it('fills the ollie meter in a loop and lands only inside the window', () => {
    expect(meterValueAt(0)).toBe(0);
    expect(meterValueAt(OLLIE_CYCLE_MS / 2)).toBe(50);
    expect(meterValueAt(OLLIE_CYCLE_MS * 1.5)).toBe(50);
    expect(ollieResultFor(80)).toBe('landed');
    expect(ollieResultFor(69)).toBe('missed');
    expect(ollieResultFor(91)).toBe('missed');
  });
});
