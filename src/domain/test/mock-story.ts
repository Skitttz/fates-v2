import { StoryModel } from '../models';

export const mockStoryModel = (overrides: Partial<StoryModel> = {}): StoryModel => ({
  id: 'any-story',
  title: 'Any story',
  scenes: [
    {
      id: 'scene-real',
      world: 'real',
      backdrop: 'pista-dia',
      actors: [{ id: 'paulo', x: 40, y: 112, pose: 'skate' }],
      lines: [
        { speaker: null, text: 'Any narration' },
        { speaker: 'paulo', text: 'Any line' },
      ],
      interaction: { type: 'ollie' },
    },
    {
      id: 'scene-dream',
      world: 'dream',
      backdrop: 'sonho',
      transitionIn: 'fade-to-dream',
      actors: [{ id: 'paulo', x: 40, y: 112, pose: 'skate' }],
      lines: [],
      interaction: { type: 'walk-to', actor: 'paulo', targetX: 150 },
    },
    {
      id: 'scene-choice',
      world: 'real',
      backdrop: 'pista-noite',
      transitionIn: 'flash-to-real',
      actors: [],
      lines: [{ speaker: 'urso', text: 'Any bear line' }],
      interaction: {
        type: 'choice',
        prompt: 'Any prompt',
        options: [
          { id: 'caixote', label: 'Caixote', photo: 'caixote', outcome: 'Any caixote outcome' },
          { id: 'poste', label: 'Poste', photo: 'poste', outcome: 'Any poste outcome' },
        ],
      },
    },
  ],
  epilogue: 'Any epilogue',
  ...overrides,
});
