import '@/presentation/test/mock-next-navigation';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StoryMemoryModel } from '@/domain/models/story-memory-model';
import { mockStoryModel } from '@/domain/test';
import { StreetGallery } from '@/presentation/components/sections/StreetGallery';
import { StoryMemoryProvider } from '@/presentation/contexts/story-memory';
import { StoryGame } from './StoryGame';

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
});
afterEach(() => vi.unstubAllGlobals());

const story = () => {
  const base = mockStoryModel();
  return mockStoryModel({
    id: 'como-tudo-comecou',
    scenes: [
      {
        ...base.scenes[2],
        lines: [],
        transitionIn: undefined,
        interaction: {
          type: 'choice',
          prompt: 'Onde colar?',
          options: [
            {
              id: 'poste',
              label: 'No poste',
              photo: 'poste',
              outcome: 'Outro caminho começa.',
              consequence: {
                title: 'Alguém parou para olhar',
                text: 'Uma pessoa fotografa o adesivo e chama um amigo.',
                place: 'poste',
              },
            },
          ],
        },
      },
    ],
  });
};

describe('the sticker follows the visitor', () => {
  it('shows the consequence, saves the choice, and marks the gallery after remounting', () => {
    let saved: StoryMemoryModel | null = null;
    const storage = {
      load: () => saved,
      save: vi.fn((value: StoryMemoryModel) => {
        saved = value;
      }),
    };
    const { unmount } = render(
      <StoryMemoryProvider loadMemory={storage} saveMemory={storage}>
        <StoryGame story={story()} />
      </StoryMemoryProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'No poste' }));
    expect(screen.getByRole('region', { name: 'Seu adesivo ganhou a rua' })).toHaveFocus();
    expect(
      screen.getByText('Uma pessoa fotografa o adesivo e chama um amigo.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Final da história' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver meu destino' }));
    expect(screen.getByRole('region', { name: 'Final da história' })).toHaveFocus();
    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(saved).toEqual({ storyId: 'como-tudo-comecou', place: 'poste', ollieLanded: false });
    const arrow = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    });
    document.activeElement?.dispatchEvent(arrow);
    expect(arrow.defaultPrevented).toBe(false);
    unmount();
    render(
      <StoryMemoryProvider loadMemory={storage} saveMemory={storage}>
        <StreetGallery />
      </StoryMemoryProvider>,
    );
    const sticker = screen.getByText('Você deixou sua marca');
    expect(sticker.closest('figure')).toHaveTextContent('todo poste é vitrine');
    expect(screen.getByText(/Seu primeiro adesivo ficou no poste/)).toBeInTheDocument();
  });

  it('does not invent a choice or erase a previous memory when the story is skipped', () => {
    const previous = { storyId: 'como-tudo-comecou', place: 'caixote' as const, ollieLanded: true };
    const storage = { load: () => previous, save: vi.fn() };
    render(
      <StoryMemoryProvider loadMemory={storage} saveMemory={storage}>
        <StoryGame story={story()} />
      </StoryMemoryProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    expect(storage.save).not.toHaveBeenCalled();
    expect(screen.queryByText('★ Ollie cravado')).not.toBeInTheDocument();
  });
});
