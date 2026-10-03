import { describe, expect, it } from 'vitest';
import { dialogueBoxStyles } from './DialogueBox/styles';
import { storyEndingStyles } from './StoryEnding/styles';
import { storyGameStyles } from './StoryGame/styles';
import { storyToolbarStyles } from './StoryToolbar/styles';
import { transcriptLineStyles } from './TranscriptLine/styles';
import { walkIntroStyles } from './WalkIntro/styles';

describe('story styles', () => {
  it('highlights the sound toggle only while the sound is on', () => {
    const on = storyToolbarStyles({ soundOn: true });
    const off = storyToolbarStyles({ soundOn: false });

    expect(on.sound().split(' ')).toEqual(
      expect.arrayContaining(['min-h-12', 'border-2', 'border-street-lime', 'text-street-lime']),
    );
    expect(on.sound()).not.toContain('!');
    expect(on.sound()).not.toContain('text-zinc-300');
    expect(on.soundIcon()).toContain('motion-safe:animate-pulse');
    expect(off.sound().split(' ')).toEqual(expect.arrayContaining(['min-h-12', 'text-zinc-300']));
    expect(off.sound()).not.toContain('border-street-lime');
    expect(off.soundIcon()).toBe('size-4');
  });

  it('dresses the toolbar and ending actions as buttons', () => {
    const toolbar = storyToolbarStyles();
    const ending = storyEndingStyles();

    expect(toolbar.mode().split(' ')).toEqual(
      expect.arrayContaining(['min-h-12', 'border-zinc-50']),
    );
    expect(toolbar.skip().split(' ')).toEqual(
      expect.arrayContaining(['min-h-12', 'text-zinc-300']),
    );
    expect(ending.drop().split(' ')).toEqual(expect.arrayContaining(['bg-street-lime', 'h-14']));
    expect(ending.city().split(' ')).toEqual(expect.arrayContaining(['border-zinc-50', 'h-14']));
    expect(ending.restart().split(' ')).toEqual(expect.arrayContaining(['text-zinc-300', 'h-14']));
  });

  it('writes narration in italics in the dialogue and in the transcript', () => {
    expect(dialogueBoxStyles({ narration: true }).text()).toBe('italic text-zinc-300');
    expect(dialogueBoxStyles({ narration: false }).text()).toBeUndefined();
    expect(transcriptLineStyles({ narration: true }).root()).toBe('italic text-zinc-300');
    expect(transcriptLineStyles({ narration: false }).root()).toBeUndefined();
  });

  it('animates the walk intro only with motion', () => {
    expect(walkIntroStyles({ animated: true }).card()).toContain('animate-page-in');
    expect(walkIntroStyles({ animated: false }).card()).not.toContain('animate-page-in');
  });

  it('keeps the dialogue panel in the flow, below the canvas', () => {
    expect(storyGameStyles().panel()).not.toMatch(/absolute/);
  });
});
