import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StoryTransition, StoryWorld } from '@/domain/models';
import { mockStoryModel } from '@/domain/test';
import { SoundPlayer } from '@/presentation/protocols';
import {
  OLLIE_ANIMATION_MS,
  PLACING_MS,
  TRANSITION_MS,
} from '@/presentation/story/engine/constants';
import {
  BLIP_VOLUME,
  EFFECT_SOUNDS,
  WAKE_MUSIC,
  WALK_SOUND_VOLUME,
} from '@/presentation/story/sounds';
import {
  useOllieAnimation,
  usePlacing,
  useRestartFocus,
  useSceneTransition,
  useStoryFlow,
  useStoryKeyboard,
  useStorySounds,
  useStoryWalk,
  useWalkDirection,
  useWalkIntro,
  WALK_INTRO_MS,
} from '.';

const fakePlayer = (): SoundPlayer => ({
  setEnabled: vi.fn(),
  play: vi.fn(),
  preload: vi.fn(),
  resume: vi.fn(),
  loop: vi.fn(),
  stopLoop: vi.fn(),
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
});

const played = (player: SoundPlayer) => vi.mocked(player.play).mock.calls.map(([id]) => id);

const advanceFrames = (durationMs: number) => {
  for (let elapsed = 0; elapsed < durationMs; elapsed += 16) {
    act(() => vi.advanceTimersByTime(16));
  }
};

beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      'setTimeout',
      'clearTimeout',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'performance',
    ],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useWalkIntro', () => {
  const render = (key: string | null, instant = false, steering = false) =>
    renderHook((props) => useWalkIntro(props.key, props.instant, props.steering), {
      initialProps: { key, instant, steering },
    });

  it('locks the walk while the intro plays and releases it after', () => {
    const { result } = render('1');
    expect(result.current).toMatchObject({ released: false, visible: true });

    act(() => vi.advanceTimersByTime(WALK_INTRO_MS));

    expect(result.current).toMatchObject({ released: true, visible: true });
  });

  it('leaves as soon as the visitor steers after the release and stays away', () => {
    const { result, rerender } = render('1', false, true);
    expect(result.current.visible).toBe(true);

    act(() => vi.advanceTimersByTime(WALK_INTRO_MS));
    expect(result.current.visible).toBe(false);

    rerender({ key: '1', instant: false, steering: false });
    expect(result.current.visible).toBe(false);
  });

  it('ignores a tap that ends before the release', () => {
    const { result, rerender } = render('1', false, true);
    rerender({ key: '1', instant: false, steering: false });

    act(() => vi.advanceTimersByTime(WALK_INTRO_MS));

    expect(result.current).toMatchObject({ released: true, visible: true });
  });

  it('leaves when dismissed by a jump', () => {
    const { result } = render('1', true);

    act(() => result.current.dismiss());

    expect(result.current.visible).toBe(false);
  });

  it('comes back for the same walk after the story restarts', () => {
    const { result, rerender } = render('1', false, true);
    act(() => vi.advanceTimersByTime(WALK_INTRO_MS));
    expect(result.current.visible).toBe(false);

    rerender({ key: null, instant: false, steering: false });
    rerender({ key: '1', instant: false, steering: false });

    expect(result.current).toMatchObject({ released: false, visible: true });
  });

  it('releases at once when instant and never without a walk', () => {
    expect(render('1', true).result.current).toMatchObject({ released: true, visible: true });
    expect(render(null, true).result.current).toMatchObject({ released: false, visible: false });
  });
});

describe('useWalkDirection', () => {
  it('stops when the window loses focus', () => {
    const { result } = renderHook(() => useWalkDirection());
    act(() => result.current[1](1));
    expect(result.current[0]).toBe(1);

    fireEvent.blur(window);

    expect(result.current[0]).toBe(0);
  });
});

describe('usePlacing', () => {
  it('finishes with the choice after the animation and ignores a second choice', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      usePlacing({ player: fakePlayer(), reducedMotion: false, onFinish }),
    );

    act(() => result.current.choose('poste'));
    act(() => result.current.choose('caixote'));
    expect(result.current.placing).toBe('poste');

    act(() => vi.advanceTimersByTime(PLACING_MS + 50));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith('poste');
    expect(result.current.placing).toBeNull();
  });

  it('plays the stamp once when the sticker lands', () => {
    const player = fakePlayer();
    const { result } = renderHook(() =>
      usePlacing({ player, reducedMotion: false, onFinish: vi.fn() }),
    );

    act(() => result.current.choose('poste'));
    expect(played(player)).toEqual([]);
    advanceFrames(PLACING_MS + 50);

    expect(played(player)).toEqual(['sticker-place']);
  });

  it('hands back the pending choice when cancelled and does not finish', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      usePlacing({ player: fakePlayer(), reducedMotion: false, onFinish }),
    );
    act(() => result.current.choose('poste'));

    let pending: string | null = null;
    act(() => {
      pending = result.current.cancel();
    });
    act(() => vi.advanceTimersByTime(PLACING_MS + 50));

    expect(pending).toBe('poste');
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('plays the stamp at once with reduced motion', () => {
    const player = fakePlayer();
    const onFinish = vi.fn();
    const { result } = renderHook(() => usePlacing({ player, reducedMotion: true, onFinish }));

    act(() => result.current.choose('poste'));

    expect(played(player)).toEqual(['sticker-place']);
    expect(onFinish).toHaveBeenCalledWith('poste');
  });
});

describe('useOllieAnimation', () => {
  it('plays each cue of the timeline once and reports the result', () => {
    const player = fakePlayer();
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useOllieAnimation({ player, reducedMotion: false, onFinish }),
    );

    act(() => result.current.start('landed'));
    expect(result.current.ollie).toEqual({ result: 'landed' });
    act(() => vi.advanceTimersByTime(OLLIE_ANIMATION_MS + 50));

    expect(played(player)).toEqual(['ollie', 'landing', 'fall']);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith('landed');
    expect(result.current.ollie).toBeNull();
  });

  it('plays every cue at once with reduced motion', () => {
    const player = fakePlayer();
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useOllieAnimation({ player, reducedMotion: true, onFinish }),
    );

    act(() => result.current.start('missed'));

    expect(played(player)).toEqual(['ollie', 'fall']);
    expect(onFinish).toHaveBeenCalledWith('missed');
  });

  it('starts the cues over on a second ollie', () => {
    const player = fakePlayer();
    const { result } = renderHook(() =>
      useOllieAnimation({ player, reducedMotion: false, onFinish: vi.fn() }),
    );
    act(() => result.current.start('missed'));
    act(() => vi.advanceTimersByTime(OLLIE_ANIMATION_MS + 50));

    act(() => result.current.start('missed'));
    expect(played(player)).toEqual(['ollie', 'fall', 'ollie']);
    act(() => vi.advanceTimersByTime(OLLIE_ANIMATION_MS + 50));

    expect(played(player)).toEqual(['ollie', 'fall', 'ollie', 'fall']);
  });

  it('does not report anything after a cancel', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useOllieAnimation({ player: fakePlayer(), reducedMotion: false, onFinish }),
    );
    act(() => result.current.start('landed'));

    act(() => result.current.cancel());
    act(() => vi.advanceTimersByTime(OLLIE_ANIMATION_MS + 50));

    expect(onFinish).not.toHaveBeenCalled();
  });
});

describe('useStorySounds', () => {
  type Props = {
    world: StoryWorld;
    rolling: boolean;
    transition: StoryTransition | null;
    sceneIndex: number;
    speaker: string | null;
    typedCount: number;
    typing: boolean;
  };

  const quiet: Props = {
    world: 'real',
    rolling: false,
    transition: null,
    sceneIndex: 0,
    speaker: null,
    typedCount: 0,
    typing: false,
  };

  const render = (initialProps: Props) => {
    const player = fakePlayer();
    const hook = renderHook((props: Props) => useStorySounds({ player, ...props }), {
      initialProps,
    });
    return { player, ...hook };
  };

  it('preloads the effects and follows the world with the music', () => {
    const { player, rerender, unmount } = render({ ...quiet, world: 'dream' });
    expect(player.preload).toHaveBeenCalledWith(EFFECT_SOUNDS);
    expect(player.playMusic).toHaveBeenLastCalledWith('music-dream', undefined);

    rerender(quiet);
    expect(player.playMusic).toHaveBeenLastCalledWith('music-real', WAKE_MUSIC);

    unmount();
    expect(player.stopMusic).toHaveBeenCalledTimes(1);
  });

  it('loops the skate only while rolling', () => {
    const { player, rerender } = render(quiet);
    expect(player.loop).not.toHaveBeenCalled();

    rerender({ ...quiet, rolling: true });
    expect(player.loop).toHaveBeenCalledWith('skate-roll');

    rerender(quiet);
    expect(player.stopLoop).toHaveBeenCalledWith('skate-roll');
  });

  it('plays the transition sound once per scene', () => {
    const { player, rerender } = render(quiet);

    rerender({ ...quiet, transition: 'fade-to-dream', sceneIndex: 1 });
    rerender({ ...quiet, transition: 'fade-to-dream', sceneIndex: 1, typedCount: 1 });

    expect(vi.mocked(player.play).mock.calls).toEqual([['enter-dream', { volume: 0.8 }]]);
  });

  it('blips on every other typed character while typing', () => {
    const { player, rerender } = render({ ...quiet, typing: true });

    rerender({ ...quiet, typing: true, typedCount: 1 });
    rerender({ ...quiet, typing: true, typedCount: 2 });
    rerender({ ...quiet, typing: false, typedCount: 4 });

    expect(vi.mocked(player.play).mock.calls).toEqual([
      ['text-blip', { rate: 0.9, volume: BLIP_VOLUME }],
    ]);
  });
});

describe('useStoryKeyboard', () => {
  const render = (patch: Partial<Parameters<typeof useStoryKeyboard>[0]> = {}) => {
    const handlers = { onDirection: vi.fn(), onJump: vi.fn(), onAdvance: vi.fn() };
    renderHook(() =>
      useStoryKeyboard({
        active: true,
        holding: true,
        walking: false,
        dialogue: false,
        ...handlers,
        ...patch,
      }),
    );
    return handlers;
  };

  it('steers with the arrows and stops when they are released', () => {
    const { onDirection } = render({ walking: true });

    expect(fireEvent.keyDown(window, { key: 'ArrowLeft' })).toBe(false);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyUp(window, { key: 'ArrowRight' });

    expect(onDirection.mock.calls).toEqual([[-1], [1], [0]]);
  });

  it('jumps once per press with space or the up arrow', () => {
    const { onJump, onAdvance } = render({ walking: true });

    fireEvent.keyDown(window, { key: ' ', code: 'Space' });
    fireEvent.keyDown(window, { key: ' ', code: 'Space', repeat: true });
    fireEvent.keyDown(window, { key: 'ArrowUp' });

    expect(onJump).toHaveBeenCalledTimes(2);
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it('advances the dialogue with space or enter, but not from a button', () => {
    const { onAdvance } = render({ dialogue: true });
    const button = document.body.appendChild(document.createElement('button'));

    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: ' ', code: 'Space' });
    fireEvent.keyDown(button, { key: 'Enter' });
    button.remove();

    expect(onAdvance).toHaveBeenCalledTimes(2);
  });

  it('leaves the keys alone when the game is not holding them', () => {
    const { onDirection, onJump } = render({ walking: true, holding: false });

    expect(fireEvent.keyDown(window, { key: 'ArrowRight' })).toBe(true);
    fireEvent.keyDown(window, { key: ' ', code: 'Space' });

    expect(onDirection).not.toHaveBeenCalled();
    expect(onJump).not.toHaveBeenCalled();
  });

  it('does not listen while inactive', () => {
    const { onAdvance } = render({ dialogue: true, active: false });

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(onAdvance).not.toHaveBeenCalled();
  });
});

describe('useRestartFocus', () => {
  it('focuses the target only after a request, once it is ready', () => {
    const section = document.body.appendChild(document.createElement('section'));
    const button = section.appendChild(document.createElement('button'));
    const ref = { current: section };
    const { result, rerender } = renderHook(
      ({ ready, step }) => useRestartFocus(ref, 'button', ready, step),
      { initialProps: { ready: true, step: 'a' } },
    );
    expect(button).not.toHaveFocus();

    result.current();
    rerender({ ready: false, step: 'b' });
    expect(button).not.toHaveFocus();
    rerender({ ready: true, step: 'c' });

    expect(button).toHaveFocus();
    section.remove();
  });
});

describe('useStoryFlow', () => {
  it('starts at the first line and follows the story actions', () => {
    const { result } = renderHook(() => useStoryFlow(mockStoryModel()));
    expect(result.current.moment).toMatchObject({
      inDialogue: true,
      line: { text: 'Any narration' },
    });

    act(() => result.current.actions.nextLine());
    expect(result.current.moment.line?.text).toBe('Any line');

    act(() => result.current.actions.nextLine());
    expect(result.current.moment.awaitsOllie).toBe(true);

    act(() => result.current.actions.finishOllie('landed'));
    expect(result.current.state).toMatchObject({ ollieResult: 'landed', phase: 'transition' });

    act(() => result.current.actions.endTransition());
    expect(result.current.moment.walkKey).toBe('1');

    act(() => result.current.actions.completeWalk());
    act(() => result.current.actions.endTransition());
    act(() => result.current.actions.nextLine());
    expect(result.current.moment.choice).toBeDefined();

    act(() => result.current.actions.finishPlacing('poste'));
    expect(result.current.state.choice).toBe('poste');
    expect(result.current.moment.ended).toBe(true);
  });

  it('skips with the pending choice, restarts and keeps the same actions', () => {
    const story = mockStoryModel();
    const { result } = renderHook(() => useStoryFlow(story));
    const { actions } = result.current;

    act(() => actions.skip('caixote'));
    expect(result.current.moment.ended).toBe(true);
    expect(result.current.state.choice).toBe('caixote');

    act(() => actions.restart());
    expect(result.current.moment.inDialogue).toBe(true);
    expect(result.current.state.choice).toBeNull();
    expect(result.current.actions).toBe(actions);
  });
});

describe('useSceneTransition', () => {
  const scene = mockStoryModel().scenes[1];

  it('follows the transition and reports its end once', () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() =>
      useSceneTransition({
        phase: 'transition',
        scene,
        sceneIndex: 1,
        reducedMotion: false,
        onEnd,
      }),
    );
    expect(result.current).toEqual({ kind: 'fade-to-dream', progress: 0 });

    advanceFrames(TRANSITION_MS / 2);
    expect(result.current?.progress).toBeGreaterThan(0.3);
    expect(onEnd).not.toHaveBeenCalled();

    advanceFrames(TRANSITION_MS);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('ends at once with reduced motion and is absent outside a transition', () => {
    const onEnd = vi.fn();
    renderHook(() =>
      useSceneTransition({ phase: 'transition', scene, sceneIndex: 1, reducedMotion: true, onEnd }),
    );
    expect(onEnd).toHaveBeenCalledTimes(1);

    const { result } = renderHook(() =>
      useSceneTransition({ phase: 'dialogue', scene, sceneIndex: 1, reducedMotion: false, onEnd }),
    );
    expect(result.current).toBeNull();
  });
});

describe('useStoryWalk', () => {
  const walk = { type: 'walk-to' as const, actor: 'paulo', targetX: 150 };
  const actor = { id: 'paulo', x: 40, y: 112, pose: 'skate' };

  const render = (patch: Partial<Parameters<typeof useStoryWalk>[0]> = {}) => {
    const player = fakePlayer();
    const onArrive = vi.fn();
    const hook = renderHook(() =>
      useStoryWalk({
        player,
        walk,
        actor,
        walkKey: '1',
        enabled: true,
        reducedMotion: true,
        onArrive,
        ...patch,
      }),
    );
    return { player, onArrive, ...hook };
  };

  it('shows the intro until the visitor steers, then rolls', () => {
    const { result } = render();
    expect(result.current).toMatchObject({ introVisible: true, rolling: false, direction: 0 });
    expect(result.current.actorOverrides).toEqual({ paulo: { x: 40, y: 112, pose: 'skate' } });

    act(() => result.current.steer(1));

    expect(result.current).toMatchObject({ introVisible: false, rolling: true, direction: 1 });
    expect(result.current.actorOverrides?.paulo.pose).toBe('skate-andando');
  });

  it('ignores the jump during the intro and jumps after it', () => {
    const { result, player } = render({ reducedMotion: false });

    act(() => result.current.jump());
    advanceFrames(100);
    expect(played(player)).toEqual([]);
    expect(result.current.introVisible).toBe(true);

    advanceFrames(WALK_INTRO_MS);
    act(() => result.current.jump());
    advanceFrames(100);

    expect(vi.mocked(player.play).mock.calls[0]).toEqual(['ollie', { volume: WALK_SOUND_VOLUME }]);
    expect(result.current.introVisible).toBe(false);
  });

  it('stops, plays the find and reports the arrival at the target', () => {
    const { result, player, onArrive } = render({ walk: { ...walk, targetX: 46 } });

    act(() => result.current.steer(1));
    advanceFrames(600);

    expect(onArrive).toHaveBeenCalledTimes(1);
    expect(played(player)).toContain('sticker-found');
    expect(result.current.direction).toBe(0);
  });

  it('stays out of the way without a walk or outside the game', () => {
    const idle = render({ walk: undefined, actor: undefined, walkKey: null });
    expect(idle.result.current).toMatchObject({ introVisible: false, rolling: false });
    expect(idle.result.current.actorOverrides).toBeUndefined();

    const reading = render({ enabled: false });
    act(() => reading.result.current.steer(1));
    advanceFrames(200);

    expect(reading.result.current.rolling).toBe(false);
    expect(reading.result.current.actorOverrides?.paulo.x).toBe(40);
  });
});
