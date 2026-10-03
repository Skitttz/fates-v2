import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { dialogueBoxStyles } from './DialogueBox/styles';
import { storyEndingStyles } from './StoryEnding/styles';
import { storyGameStyles } from './StoryGame/styles';
import { storyToolbarStyles } from './StoryToolbar/styles';
import { transcriptLineStyles } from './TranscriptLine/styles';
import { walkIntroStyles } from './WalkIntro/styles';

type StyleOutput = string | undefined | Record<string, () => string | undefined>;

type StyleModule = Record<string, () => StyleOutput>;

const here = dirname(fileURLToPath(import.meta.url));

const styledFolders = readdirSync(here).filter((name) => existsSync(join(here, name, 'styles.ts')));

const classNames = (output: StyleOutput): (string | undefined)[] =>
  typeof output === 'object' ? Object.values(output).map((slot) => slot()) : [output];

describe('story styles', () => {
  it('only ever writes class names into the markup', async () => {
    const modules: StyleModule[] = await Promise.all(
      styledFolders.map((folder) => import(`./${folder}/styles.ts`)),
    );
    const outputs = modules
      .flatMap((exported) => Object.values(exported))
      .flatMap((styles) => classNames(styles()));

    expect(styledFolders.length).toBeGreaterThan(15);
    expect(outputs.length).toBeGreaterThan(60);
    expect(outputs.filter((value) => value?.includes('native code'))).toEqual([]);
  });

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
