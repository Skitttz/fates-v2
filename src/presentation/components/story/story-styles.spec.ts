import { describe, expect, it } from 'vitest';
import { dialogueBoxStyles } from './DialogueBox/styles';
import { storyGameStyles } from './StoryGame/styles';
import { storyToolbarStyles } from './StoryToolbar/styles';
import { storyTranscriptStyles } from './StoryTranscript/styles';
import { walkIntroStyles } from './WalkIntro/styles';

describe('story styles', () => {
  it('highlights the sound toggle only while the sound is on', () => {
    const on = storyToolbarStyles({ soundOn: true });
    const off = storyToolbarStyles({ soundOn: false });

    expect(on.sound()).toContain('border-street-lime');
    expect(on.sound()).not.toContain('!');
    expect(on.soundIcon()).toContain('motion-safe:animate-pulse');
    expect(off.sound()).toBe('min-h-12');
    expect(off.soundIcon()).toBe('size-4');
  });

  it('writes narration in italics in the dialogue and in the transcript', () => {
    expect(dialogueBoxStyles({ narration: true }).text()).toBe('italic text-zinc-300');
    expect(dialogueBoxStyles({ narration: false }).text()).toBeUndefined();
    expect(storyTranscriptStyles({ narration: true }).line()).toBe('italic text-zinc-300');
    expect(storyTranscriptStyles({ narration: false }).line()).toBeUndefined();
  });

  it('animates the walk intro only with motion', () => {
    expect(walkIntroStyles({ animated: true }).card()).toContain('animate-page-in');
    expect(walkIntroStyles({ animated: false }).card()).not.toContain('animate-page-in');
  });

  it('keeps the dialogue panel in the flow, below the canvas', () => {
    expect(storyGameStyles().panel()).not.toMatch(/absolute/);
  });
});
