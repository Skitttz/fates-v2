import '@/presentation/test/mock-next-navigation';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockStoryModel } from '@/domain/test';
import { OLLIE_CYCLE_MS } from '@/presentation/story/engine/ollie';
import {
  ChoiceMenu,
  DialogueBox,
  OllieMeter,
  StoryEnding,
  StoryToolbar,
  StoryTranscript,
  TouchControls,
} from '.';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DialogueBox', () => {
  it('shows the speaker and the typed text and activates on click', async () => {
    const onActivate = vi.fn();
    render(<DialogueBox speaker="urso" visibleText="Oi" onActivate={onActivate} />);

    expect(screen.getByText('Ursinho')).toBeInTheDocument();
    expect(screen.getByText('Oi')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Avançar diálogo' }));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('shows narration without speaker name', () => {
    render(<DialogueBox speaker={null} visibleText="Aracaju." onActivate={vi.fn()} />);

    expect(screen.queryByText('Paulo')).not.toBeInTheDocument();
    expect(screen.getByText('Aracaju.')).toBeInTheDocument();
  });
});

describe('ChoiceMenu', () => {
  it('lists the options and returns the chosen id', async () => {
    const onChoose = vi.fn();
    render(
      <ChoiceMenu
        prompt="Onde colar?"
        options={[
          { id: 'caixote', label: 'No caixote' },
          { id: 'poste', label: 'No poste' },
        ]}
        onChoose={onChoose}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'No poste' }));

    expect(screen.getByRole('group', { name: 'Onde colar?' })).toBeInTheDocument();
    expect(onChoose).toHaveBeenCalledWith('poste');
  });

  const OPTIONS = [
    { id: 'caixote', label: 'No caixote' },
    { id: 'poste', label: 'No poste' },
    { id: 'moletom', label: 'No moletom' },
  ];

  it('moves the focus with the arrows, wraps around and supports Home and End', async () => {
    const onMove = vi.fn();
    render(<ChoiceMenu prompt="Onde?" options={OPTIONS} onChoose={vi.fn()} onMove={onMove} />);
    const button = (name: string) => screen.getByRole('button', { name });

    expect(button('No caixote')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(button('No poste')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(button('No moletom')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(button('No caixote')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(button('No moletom')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(button('No poste')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(button('No caixote')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(button('No moletom')).toHaveFocus();
    expect(onMove).toHaveBeenCalledTimes(7);
  });

  it('confirms the focused option with Enter and keeps a single tab stop', async () => {
    const onChoose = vi.fn();
    render(<ChoiceMenu prompt="Onde?" options={OPTIONS} onChoose={onChoose} />);

    await userEvent.keyboard('{ArrowRight}{Enter}');

    expect(onChoose).toHaveBeenCalledWith('poste');
    expect(screen.getByRole('button', { name: 'No poste' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'No caixote' })).toHaveAttribute('tabindex', '-1');
  });

  it('does not report a move when Home is pressed on the first option', async () => {
    const onMove = vi.fn();
    render(<ChoiceMenu prompt="Onde?" options={OPTIONS} onChoose={vi.fn()} onMove={onMove} />);

    await userEvent.keyboard('{Home}');

    expect(onMove).not.toHaveBeenCalled();
  });
});

describe('OllieMeter', () => {
  it('reports the result only once even with click and keyboard', async () => {
    const now = vi.spyOn(performance, 'now').mockReturnValue(1000);
    const onResult = vi.fn();
    render(<OllieMeter onResult={onResult} />);
    now.mockReturnValue(1000 + OLLIE_CYCLE_MS * 0.8);

    await userEvent.click(screen.getByRole('button', { name: 'Ollie!' }));
    fireEvent.keyDown(window, { code: 'Space', key: ' ' });

    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith('landed');
  });
});

describe('TouchControls', () => {
  it('reports the direction while pressed', () => {
    const onDirectionChange = vi.fn();
    render(<TouchControls visible onDirectionChange={onDirectionChange} />);
    const right = screen.getByRole('button', { name: 'Mover para a direita' });

    fireEvent.pointerDown(right);
    fireEvent.pointerUp(right);

    expect(onDirectionChange.mock.calls).toEqual([[1], [0]]);
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<TouchControls visible={false} onDirectionChange={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('StoryToolbar', () => {
  it('skips and toggles the text mode', async () => {
    const onSkip = vi.fn();
    const onToggleMode = vi.fn();
    render(<StoryToolbar mode="game" ended={false} onSkip={onSkip} onToggleMode={onToggleMode} />);

    await userEvent.click(screen.getByRole('button', { name: 'Pular história' }));
    await userEvent.click(screen.getByRole('button', { name: 'Ler como texto' }));

    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onToggleMode).toHaveBeenCalledTimes(1);
  });

  it('hides skip when the story ended and offers the game back in text mode', () => {
    render(<StoryToolbar mode="text" ended onSkip={vi.fn()} onToggleMode={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'Pular história' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar ao jogo' })).toBeInTheDocument();
  });
});

describe('StoryTranscript', () => {
  it('renders every line, the interactions and the epilogue', () => {
    render(<StoryTranscript story={mockStoryModel()} />);

    expect(screen.getByText('Any narration')).toBeInTheDocument();
    expect(screen.getByText('Any line')).toBeInTheDocument();
    expect(screen.getByText('Paulo tenta um ollie.')).toBeInTheDocument();
    expect(screen.getByText('Paulo segue o brilho.')).toBeInTheDocument();
    expect(screen.getByText('Any prompt')).toBeInTheDocument();
    expect(screen.getByText('Any epilogue')).toBeInTheDocument();
  });

  it('labels conditional lines and lists each choice with its outcome', () => {
    const story = mockStoryModel();
    story.scenes[0].lines = [
      { speaker: 'urso', text: 'Missed line', when: { ollie: 'missed' } },
      { speaker: 'urso', text: 'Landed line', when: { ollie: 'landed' } },
    ];

    render(<StoryTranscript story={story} />);

    expect(screen.getByText('(se o ollie não deu certo)')).toBeInTheDocument();
    expect(screen.getByText('(se o ollie deu certo)')).toBeInTheDocument();
    expect(screen.getByText('Caixote: Any caixote outcome')).toBeInTheDocument();
  });
});

describe('StoryEnding', () => {
  it('shows the chosen photo, the epilogue and restarts', async () => {
    const onRestart = vi.fn();
    render(<StoryEnding epilogue="Fim." outcome={null} photoId="poste" onRestart={onRestart} />);

    expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringContaining('poste'));
    expect(screen.getByText('Fim.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver o drop' })).toHaveAttribute('href', '/products');
    await userEvent.click(screen.getByRole('button', { name: 'Jogar de novo' }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('shows the outcome of the choice above the epilogue', () => {
    render(
      <StoryEnding
        epilogue="Any epilogue"
        outcome="Any outcome"
        photoId="poste"
        onRestart={vi.fn()}
      />,
    );

    const outcome = screen.getByText('Any outcome');
    expect(outcome.compareDocumentPosition(screen.getByText('Any epilogue'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('takes the focus without drawing the focus ring around the whole ending', () => {
    render(<StoryEnding epilogue="Fim." outcome={null} photoId="poste" onRestart={vi.fn()} />);

    const ending = screen.getByRole('region', { name: 'Final da história' });
    expect(ending).toHaveFocus();
    expect(ending).toHaveClass('focus-visible:ring-0', 'focus-visible:ring-offset-0');
  });

  it('uses the default photo when there is no choice', () => {
    render(<StoryEnding epilogue="Fim." outcome={null} photoId={null} onRestart={vi.fn()} />);

    expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringContaining('caixote'));
  });
});
