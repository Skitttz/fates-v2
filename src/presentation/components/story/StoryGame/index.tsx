'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { StoryWorld } from '@/domain/models';
import { useSound } from '@/presentation/contexts/sound';
import { useGameFocus } from '@/presentation/hooks/useGameFocus';
import { usePrefersReducedMotion } from '@/presentation/hooks/usePrefersReducedMotion';
import { useProgress } from '@/presentation/hooks/useProgress';
import { useTypewriter } from '@/presentation/hooks/useTypewriter';
import { useWalk, WalkDirection } from '@/presentation/hooks/useWalk';
import { describeBackdrop } from '@/presentation/story/backdrop-descriptions';
import { PLACING_TIMELINE } from '@/presentation/story/engine/animations';
import {
  OLLIE_ANIMATION_MS,
  PLACING_MS,
  TRANSITION_MS,
} from '@/presentation/story/engine/constants';
import {
  createInitialState,
  choiceOutcome,
  createStoryReducer,
  getCurrentLine,
  getCurrentScene,
  OllieResult,
} from '@/presentation/story/engine/story-reducer';
import { isActionKey, isArrowKey, isFromInteractiveElement } from '@/presentation/story/keyboard';
import { photoForChoice, resolveStoryPhoto } from '@/presentation/story/photos';
import {
  BLIP_VOLUME,
  blipRate,
  EFFECT_SOUNDS,
  musicChange,
  musicFor,
  ollieSoundCues,
  shouldBlip,
  SOUNDS,
  transitionSound,
  WALK_SOUND_VOLUME,
} from '@/presentation/story/sounds';
import {
  lineAnnouncement,
  nextMode,
  OllieAnimation,
  sceneTransition,
  storyEffect,
  walkOverrides,
} from '@/presentation/story/view';
import { ChoiceMenu } from '../ChoiceMenu';
import { DialogueBox } from '../DialogueBox';
import { DIALOGUE_LABELS } from '../DialogueBox/constants';
import { GameCanvas } from '../GameCanvas';
import { OllieMeter } from '../OllieMeter';
import { StickerStamp } from '../StickerStamp';
import { StoryEnding } from '../StoryEnding';
import { StoryToolbar } from '../StoryToolbar';
import { StoryMode } from '../StoryToolbar/types';
import { StoryTranscript } from '../StoryTranscript';
import { TouchControls } from '../TouchControls';
import { WalkIntro } from '../WalkIntro';
import { STORY_GAME_LABELS, WALK_INTRO_MS } from './constants';
import { storyGameStyles } from './styles';
import { StoryGameProps } from './types';

export function StoryGame({ story }: StoryGameProps) {
  const reducer = useMemo(() => createStoryReducer(story), [story]);
  const [state, dispatch] = useReducer(reducer, story, createInitialState);
  const reducedMotion = usePrefersReducedMotion();
  const sound = useSound();
  const { player } = sound;
  const [mode, setMode] = useState<StoryMode>('game');
  const [direction, setDirection] = useState<WalkDirection>(0);
  const [ollie, setOllie] = useState<OllieAnimation | null>(null);
  const ollieRef = useRef<OllieAnimation | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const focusDialogueRef = useRef(false);
  const ollieCueRef = useRef(0);
  const [introDone, setIntroDone] = useState(false);
  const [moved, setMoved] = useState(false);
  const holdingKeys = useGameFocus(sectionRef, mode === 'game');

  const scene = getCurrentScene(story, state);
  const line = getCurrentLine(story, state);
  const interaction = state.phase === 'interaction' ? scene.interaction : undefined;
  const walk = interaction?.type === 'walk-to' ? interaction : undefined;
  const walkActor = walk ? scene.actors.find(({ id }) => id === walk.actor) : undefined;
  const typewriter = useTypewriter(line?.text ?? '', reducedMotion);
  const walkKey = walk ? String(state.sceneIndex) : null;

  useEffect(() => {
    setMoved(false);
    if (!walkKey) {
      setIntroDone(false);
      return;
    }
    if (reducedMotion) {
      setIntroDone(true);
      return;
    }
    setIntroDone(false);
    const timer = window.setTimeout(() => setIntroDone(true), WALK_INTRO_MS);
    return () => window.clearTimeout(timer);
  }, [walkKey, reducedMotion]);

  useEffect(() => {
    if (introDone && direction !== 0) setMoved(true);
  }, [introDone, direction]);

  const completeWalk = useCallback(() => {
    setDirection(0);
    player.play(SOUNDS.stickerFound);
    dispatch({ type: 'COMPLETE_INTERACTION' });
  }, [player]);

  const walking = useWalk({
    active: Boolean(walk && walkActor) && introDone && mode === 'game',
    startX: walkActor?.x ?? 0,
    targetX: walk?.targetX ?? 0,
    direction,
    obstacles: walk?.obstacles,
    onArrive: completeWalk,
    onJump: () => player.play(SOUNDS.ollie, { volume: WALK_SOUND_VOLUME }),
    onLand: () => player.play(SOUNDS.landing, { volume: WALK_SOUND_VOLUME }),
  });
  const { jump } = walking;

  const jumpWhenFree = useCallback(() => {
    if (!introDone) return;
    jump();
    setMoved(true);
  }, [introDone, jump]);

  const startOllie = useCallback(
    (result: OllieResult) => {
      ollieRef.current = { result };
      setOllie({ result });
      player.play(SOUNDS.ollie);
    },
    [player],
  );

  const finishOllie = useCallback(() => {
    const current = ollieRef.current;
    ollieRef.current = null;
    setOllie(null);
    if (!current) return;
    ollieSoundCues(current.result).forEach(({ at, sound: id }) => {
      if (ollieCueRef.current < at) player.play(id);
    });
    ollieCueRef.current = 1;
    dispatch({ type: 'COMPLETE_INTERACTION', ollieResult: current.result });
  }, [player]);

  const ollieProgress = useProgress(
    Boolean(ollie),
    reducedMotion ? 0 : OLLIE_ANIMATION_MS,
    finishOllie,
  );

  const [placing, setPlacing] = useState<string | null>(null);
  const placingRef = useRef<string | null>(null);

  const finishPlacing = useCallback(() => {
    const choice = placingRef.current;
    placingRef.current = null;
    setPlacing(null);
    if (choice) dispatch({ type: 'COMPLETE_INTERACTION', choice });
  }, []);

  const placingProgress = useProgress(
    Boolean(placing),
    reducedMotion ? 0 : PLACING_MS,
    finishPlacing,
  );

  const choose = useCallback(
    (choice: string) => {
      if (placingRef.current) return;
      placingRef.current = choice;
      setPlacing(choice);
      if (reducedMotion) player.play(SOUNDS.stickerPlace);
    },
    [player, reducedMotion],
  );

  const transitionProgress = useProgress(
    state.phase === 'transition',
    reducedMotion ? 0 : TRANSITION_MS,
    () => dispatch({ type: 'TRANSITION_END' }),
    state.sceneIndex,
  );

  const ended = state.phase === 'ending';
  const speaker = line?.speaker ?? null;
  const typedCount = typewriter.visibleText.length;
  const world = ended ? 'real' : scene.world;
  const rolling = mode === 'game' && !ended && Boolean(walk) && direction !== 0;
  const stampedRef = useRef(false);

  useEffect(() => {
    player.preload(EFFECT_SOUNDS);
  }, [player]);

  useEffect(() => {
    if (!placing) {
      stampedRef.current = false;
      return;
    }
    if (stampedRef.current || placingProgress < PLACING_TIMELINE.stampEnd) return;
    stampedRef.current = true;
    if (!reducedMotion) player.play(SOUNDS.stickerPlace);
  }, [placing, placingProgress, player, reducedMotion]);

  const previousWorldRef = useRef<StoryWorld | null>(null);

  useEffect(() => {
    player.playMusic(musicFor(world), musicChange(previousWorldRef.current, world));
    previousWorldRef.current = world;
  }, [player, world]);

  useEffect(() => {
    const stop = () => setDirection(0);
    const stopWhenHidden = () => {
      if (document.hidden) stop();
    };
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', stopWhenHidden);
    return () => {
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', stopWhenHidden);
    };
  }, []);

  useEffect(() => () => player.stopMusic(), [player]);

  useEffect(() => {
    if (!rolling) return;
    player.loop(SOUNDS.skateRoll);
    return () => player.stopLoop(SOUNDS.skateRoll);
  }, [player, rolling]);

  useEffect(() => {
    if (state.phase !== 'transition') return;
    const cue = transitionSound(scene.transitionIn);
    if (cue) player.play(cue.id, { volume: cue.volume });
  }, [player, scene.transitionIn, state.phase, state.sceneIndex]);

  useEffect(() => {
    if (typewriter.done || !shouldBlip(typedCount)) return;
    player.play(SOUNDS.textBlip, { rate: blipRate(speaker), volume: BLIP_VOLUME });
  }, [player, speaker, typedCount, typewriter.done]);

  useEffect(() => {
    if (!ollie) {
      ollieCueRef.current = 0;
      return;
    }
    const previous = ollieCueRef.current;
    ollieCueRef.current = ollieProgress;
    ollieSoundCues(ollie.result).forEach(({ at, sound: id }) => {
      if (previous < at && ollieProgress >= at) player.play(id);
    });
  }, [ollie, ollieProgress, player]);

  const handleAdvance = useCallback(() => {
    if (typewriter.done) dispatch({ type: 'NEXT_LINE' });
    else typewriter.complete();
  }, [typewriter]);

  useEffect(() => {
    if (mode !== 'game') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!holdingKeys) return;
      if (walk && (isArrowKey(event) || event.key === ' ' || event.key === 'ArrowUp')) {
        if (event.key === ' ' && isFromInteractiveElement(event)) return;
        event.preventDefault();
        if (isArrowKey(event)) {
          setDirection(event.key === 'ArrowLeft' ? -1 : 1);
          return;
        }
        if (!event.repeat) jumpWhenFree();
        return;
      }
      if (!isActionKey(event) || isFromInteractiveElement(event)) return;
      if (state.phase !== 'dialogue') return;
      event.preventDefault();
      if (!event.repeat) handleAdvance();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isArrowKey(event)) setDirection(0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleAdvance, holdingKeys, jumpWhenFree, mode, state.phase, walk]);

  const skip = () => {
    const pending = placingRef.current;
    placingRef.current = null;
    setPlacing(null);
    ollieRef.current = null;
    setOllie(null);
    dispatch({ type: 'SKIP', choice: pending ?? undefined });
  };

  const restart = () => {
    placingRef.current = null;
    setPlacing(null);
    ollieRef.current = null;
    setOllie(null);
    setDirection(0);
    focusDialogueRef.current = true;
    dispatch({ type: 'RESTART' });
  };

  useEffect(() => {
    if (!focusDialogueRef.current || state.phase !== 'dialogue') return;
    focusDialogueRef.current = false;
    sectionRef.current
      ?.querySelector<HTMLButtonElement>(`button[aria-label="${DIALOGUE_LABELS.advance}"]`)
      ?.focus();
  }, [state.phase, state.sceneIndex, state.lineIndex]);

  const renderOverlay = () => {
    if (placing) return <StickerStamp progress={placingProgress} />;
    if (walk && !moved) return <WalkIntro animated={!reducedMotion} />;
    return undefined;
  };

  const styles = storyGameStyles();

  return (
    <section ref={sectionRef} aria-label={STORY_GAME_LABELS.region} className={styles.root()}>
      <p role="status" aria-label={STORY_GAME_LABELS.currentLine} className={styles.status()}>
        {lineAnnouncement(mode, line)}
      </p>
      <StoryToolbar
        mode={mode}
        ended={ended}
        onSkip={skip}
        sound={
          sound.available
            ? { enabled: sound.enabled, onToggle: () => sound.setEnabled(!sound.enabled) }
            : undefined
        }
        onToggleMode={() => setMode(nextMode)}
      />

      {mode === 'text' && <StoryTranscript story={story} />}

      {mode === 'game' && ended && (
        <StoryEnding
          epilogue={story.epilogue}
          outcome={choiceOutcome(story, state)}
          photoId={photoForChoice(story, state.choice)}
          onRestart={restart}
        />
      )}

      {mode === 'game' && !ended && (
        <div className={styles.stage()}>
          <p className={styles.backdrop()} aria-live="polite">
            {describeBackdrop(scene.backdrop)}
          </p>
          <div className={styles.layout()}>
            <GameCanvas
              scene={scene}
              animated={!reducedMotion}
              speaker={line?.speaker ?? null}
              actorOverrides={walkOverrides(walk, walkActor, walking, direction)}
              effect={storyEffect({ placing, placingProgress, ollie, ollieProgress })}
              overlay={renderOverlay()}
              emphasis={walk && !moved && !reducedMotion ? 'adesivo' : undefined}
              underlay={
                interaction?.type === 'choice'
                  ? interaction.options.map((option) => (
                      <Image
                        key={option.id}
                        src={resolveStoryPhoto(option.photo).src}
                        alt=""
                        fill
                        loading="eager"
                        placeholder="blur"
                        sizes="(max-width: 1024px) 100vw, 960px"
                        className={`object-cover ${option.id === placing ? 'opacity-100' : 'opacity-0'}`}
                      />
                    ))
                  : undefined
              }
              transition={sceneTransition(state.phase, scene, transitionProgress)}
            />
            <div className={styles.panel()}>
              {line && (
                <DialogueBox
                  speaker={line.speaker}
                  visibleText={typewriter.visibleText}
                  onActivate={handleAdvance}
                />
              )}
              {interaction?.type === 'ollie' && !ollie && (
                <OllieMeter onResult={startOllie} listening={holdingKeys} />
              )}
              {walk && (
                <div className="border-4 border-zinc-50 bg-black p-4 font-pixel text-base text-zinc-50">
                  <p>{STORY_GAME_LABELS.walkHint}</p>
                  <p className="hidden text-sm text-zinc-400 [@media(pointer:fine)]:block">
                    {STORY_GAME_LABELS.walkKeysHint}
                  </p>
                </div>
              )}
              {interaction?.type === 'choice' && !placing && (
                <ChoiceMenu
                  prompt={interaction.prompt}
                  options={interaction.options}
                  onChoose={choose}
                  onMove={() => player.play(SOUNDS.menuSelect)}
                />
              )}
              <div className={styles.touch()}>
                <TouchControls
                  visible={Boolean(walk)}
                  onDirectionChange={setDirection}
                  onJump={jumpWhenFree}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
