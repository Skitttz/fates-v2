import { describe, expect, it } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import {
  choiceOutcome,
  createInitialState,
  createStoryReducer,
  getCurrentLine,
  getCurrentScene,
  OllieResult,
  StoryAction,
  StoryState,
  visibleLines,
} from './story-reducer';

const story = mockStoryModel();
const reducer = createStoryReducer(story);
const run = (actions: StoryAction[], from: StoryState = createInitialState(story)) =>
  actions.reduce(reducer, from);

const TO_FIRST_INTERACTION: StoryAction[] = [{ type: 'NEXT_LINE' }, { type: 'NEXT_LINE' }];

describe('story reducer', () => {
  it('starts on the first line of the first scene', () => {
    const state = createInitialState(story);

    expect(state).toMatchObject({ sceneIndex: 0, lineIndex: 0, phase: 'dialogue' });
    expect(getCurrentLine(story, state)?.text).toBe('Any narration');
  });

  it('advances the lines and then enters the interaction', () => {
    const afterFirst = run([{ type: 'NEXT_LINE' }]);
    expect(afterFirst.lineIndex).toBe(1);

    const atInteraction = run(TO_FIRST_INTERACTION);
    expect(atInteraction.phase).toBe('interaction');
    expect(getCurrentLine(story, atInteraction)).toBeNull();
  });

  it('ignores extra NEXT_LINE during an interaction', () => {
    const atInteraction = run(TO_FIRST_INTERACTION);

    expect(reducer(atInteraction, { type: 'NEXT_LINE' })).toBe(atInteraction);
  });

  it('stores the ollie result and enters the transition of the next scene', () => {
    const state = run([
      ...TO_FIRST_INTERACTION,
      { type: 'COMPLETE_INTERACTION', ollieResult: 'missed' },
    ]);

    expect(state).toMatchObject({ sceneIndex: 1, phase: 'transition', ollieResult: 'missed' });
  });

  it('ignores a second COMPLETE_INTERACTION', () => {
    const state = run([...TO_FIRST_INTERACTION, { type: 'COMPLETE_INTERACTION' }]);

    expect(reducer(state, { type: 'COMPLETE_INTERACTION' })).toBe(state);
  });

  it('goes straight to the interaction after the transition when the scene has no lines', () => {
    const state = run([
      ...TO_FIRST_INTERACTION,
      { type: 'COMPLETE_INTERACTION' },
      { type: 'TRANSITION_END' },
    ]);

    expect(state).toMatchObject({ sceneIndex: 1, phase: 'interaction' });
    expect(getCurrentScene(story, state).interaction?.type).toBe('walk-to');
  });

  it('plays until the ending and keeps the choice', () => {
    const state = run([
      ...TO_FIRST_INTERACTION,
      { type: 'COMPLETE_INTERACTION' },
      { type: 'TRANSITION_END' },
      { type: 'COMPLETE_INTERACTION' },
      { type: 'TRANSITION_END' },
      { type: 'NEXT_LINE' },
      { type: 'COMPLETE_INTERACTION', choice: 'poste' },
    ]);

    expect(state).toMatchObject({ phase: 'ending', choice: 'poste' });
  });

  it('skips scenes that have no lines and no interaction', () => {
    const base = mockStoryModel();
    const withEmptyScene = mockStoryModel({
      scenes: [
        { ...base.scenes[0], interaction: undefined },
        { id: 'empty', world: 'real', backdrop: 'pista-dia', actors: [], lines: [] },
        base.scenes[2],
      ],
    });
    const emptyReducer = createStoryReducer(withEmptyScene);
    const state = [{ type: 'NEXT_LINE' }, { type: 'NEXT_LINE' }].reduce(
      (current, action) => emptyReducer(current, action as StoryAction),
      createInitialState(withEmptyScene),
    );

    expect(state).toMatchObject({ sceneIndex: 2, phase: 'transition' });
  });

  it('skips to the ending and restarts from the beginning', () => {
    const skipped = run([{ type: 'SKIP' }]);
    expect(skipped.phase).toBe('ending');

    expect(reducer(skipped, { type: 'RESTART' })).toEqual(createInitialState(story));
  });
});

describe('conditional lines', () => {
  const branching = mockStoryModel({
    scenes: [
      {
        id: 'pista',
        world: 'real',
        backdrop: 'pista-dia',
        actors: [],
        lines: [{ speaker: null, text: 'Start' }],
        interaction: { type: 'ollie' },
      },
      {
        id: 'ursinho',
        world: 'dream',
        backdrop: 'sonho',
        actors: [],
        lines: [
          { speaker: 'urso', text: 'Missed line', when: { ollie: 'missed' } },
          { speaker: 'urso', text: 'Landed line', when: { ollie: 'landed' } },
          { speaker: 'urso', text: 'Shared line' },
        ],
      },
      {
        id: 'only-landed',
        world: 'dream',
        backdrop: 'sonho',
        actors: [],
        lines: [{ speaker: 'urso', text: 'Only landed', when: { ollie: 'landed' } }],
      },
    ],
  });
  const branchingReducer = createStoryReducer(branching);
  const play = (result: OllieResult) =>
    (
      [
        { type: 'NEXT_LINE' },
        { type: 'COMPLETE_INTERACTION', ollieResult: result },
      ] as StoryAction[]
    ).reduce(branchingReducer, createInitialState(branching));

  it('shows only the lines that match the ollie result', () => {
    const missed = play('missed');
    expect(getCurrentLine(branching, missed)?.text).toBe('Missed line');
    const shared = branchingReducer(missed, { type: 'NEXT_LINE' });
    expect(getCurrentLine(branching, shared)?.text).toBe('Shared line');

    const landed = play('landed');
    expect(getCurrentLine(branching, landed)?.text).toBe('Landed line');
  });

  it('skips a scene whose lines all belong to the other result', () => {
    const missed = play('missed');
    const ended = ([{ type: 'NEXT_LINE' }, { type: 'NEXT_LINE' }] as StoryAction[]).reduce(
      branchingReducer,
      missed,
    );

    expect(ended.phase).toBe('ending');
  });

  it('hides conditional lines while there is no result', () => {
    expect(visibleLines(branching.scenes[1], { ollieResult: null })).toEqual([
      { speaker: 'urso', text: 'Shared line' },
    ]);
  });
});

describe('choiceOutcome', () => {
  it('returns the outcome of the chosen option or null', () => {
    expect(choiceOutcome(story, { choice: 'poste' })).toBe('Any poste outcome');
    expect(choiceOutcome(story, { choice: null })).toBeNull();
    expect(choiceOutcome(story, { choice: 'lua' })).toBeNull();
  });
});
