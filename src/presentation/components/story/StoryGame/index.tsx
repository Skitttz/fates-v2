'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/presentation/hooks/usePrefersReducedMotion';
import { useProgress } from '@/presentation/hooks/useProgress';
import { useTypewriter } from '@/presentation/hooks/useTypewriter';
import { useWalk, WalkDirection } from '@/presentation/hooks/useWalk';
import { describeBackdrop } from '@/presentation/story/backdrop-descriptions';
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
import { getSpeakerName } from '@/presentation/story/speakers';
import { ChoiceMenu } from '../ChoiceMenu';
import { DialogueBox } from '../DialogueBox';
import { DIALOGUE_LABELS } from '../DialogueBox/constants';
import { GameCanvas } from '../GameCanvas';
import { OllieMeter } from '../OllieMeter';
import { StoryEnding } from '../StoryEnding';
import { StoryToolbar } from '../StoryToolbar';
import { StoryMode } from '../StoryToolbar/types';
import { StoryTranscript } from '../StoryTranscript';
import { TouchControls } from '../TouchControls';
import { GAME_LAYOUT_CLASS, GAME_PANEL_CLASS, STORY_GAME_LABELS } from './constants';
import { OllieAnimation, StoryGameProps } from './types';

export function StoryGame({ story }: StoryGameProps) {
  const reducer = useMemo(() => createStoryReducer(story), [story]);
  const [state, dispatch] = useReducer(reducer, story, createInitialState);
  const reducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<StoryMode>('game');
  const [direction, setDirection] = useState<WalkDirection>(0);
  const [ollie, setOllie] = useState<OllieAnimation | null>(null);
  const ollieRef = useRef<OllieAnimation | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const focusDialogueRef = useRef(false);

  const scene = getCurrentScene(story, state);
  const line = getCurrentLine(story, state);
  const interaction = state.phase === 'interaction' ? scene.interaction : undefined;
  const walk = interaction?.type === 'walk-to' ? interaction : undefined;
  const walkActor = walk ? scene.actors.find(({ id }) => id === walk.actor) : undefined;
  const typewriter = useTypewriter(line?.text ?? '', reducedMotion);

  const completeWalk = useCallback(() => {
    setDirection(0);
    dispatch({ type: 'COMPLETE_INTERACTION' });
  }, []);

  const walkX = useWalk({
    active: Boolean(walk && walkActor),
    startX: walkActor?.x ?? 0,
    targetX: walk?.targetX ?? 0,
    direction,
    onArrive: completeWalk,
  });

  const startOllie = useCallback((result: OllieResult) => {
    ollieRef.current = { result };
    setOllie({ result });
  }, []);

  const finishOllie = useCallback(() => {
    const current = ollieRef.current;
    ollieRef.current = null;
    setOllie(null);
    if (current) dispatch({ type: 'COMPLETE_INTERACTION', ollieResult: current.result });
  }, []);

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

  const choose = useCallback((choice: string) => {
    if (placingRef.current) return;
    placingRef.current = choice;
    setPlacing(choice);
  }, []);

  const transitionProgress = useProgress(
    state.phase === 'transition',
    reducedMotion ? 0 : TRANSITION_MS,
    () => dispatch({ type: 'TRANSITION_END' }),
    state.sceneIndex,
  );

  const handleAdvance = useCallback(() => {
    if (typewriter.done) dispatch({ type: 'NEXT_LINE' });
    else typewriter.complete();
  }, [typewriter]);

  useEffect(() => {
    if (mode !== 'game') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (walk && isArrowKey(event)) {
        event.preventDefault();
        setDirection(event.key === 'ArrowLeft' ? -1 : 1);
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
  }, [handleAdvance, mode, state.phase, walk]);

  const skip = () => {
    placingRef.current = null;
    setPlacing(null);
    ollieRef.current = null;
    setOllie(null);
    dispatch({ type: 'SKIP' });
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

  const ended = state.phase === 'ending';

  return (
    <section ref={sectionRef} aria-label={STORY_GAME_LABELS.region} className="flex flex-col gap-4">
      <p role="status" aria-label={STORY_GAME_LABELS.currentLine} className="sr-only">
        {mode === 'game' && line
          ? [getSpeakerName(line.speaker), line.text].filter(Boolean).join(': ')
          : ''}
      </p>
      <StoryToolbar
        mode={mode}
        ended={ended}
        onSkip={skip}
        onToggleMode={() => setMode((current) => (current === 'game' ? 'text' : 'game'))}
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
        <div className="flex flex-col gap-3">
          <p className="sr-only" aria-live="polite">
            {describeBackdrop(scene.backdrop)}
          </p>
          <div className={GAME_LAYOUT_CLASS}>
            <GameCanvas
              scene={scene}
              animated={!reducedMotion}
              speaker={line?.speaker ?? null}
              actorOverrides={
                walk
                  ? {
                      [walk.actor]: { x: walkX, pose: direction === 0 ? 'skate' : 'skate-andando' },
                    }
                  : undefined
              }
              effect={
                placing
                  ? { type: 'placing', progress: placingProgress }
                  : ollie
                    ? { type: 'ollie', progress: ollieProgress, result: ollie.result }
                    : null
              }
              underlay={
                placing ? (
                  <Image
                    src={resolveStoryPhoto(photoForChoice(story, placing)).src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 960px"
                    className="object-cover"
                  />
                ) : undefined
              }
              transition={
                state.phase === 'transition' && scene.transitionIn
                  ? { kind: scene.transitionIn, progress: transitionProgress }
                  : null
              }
            />
            <div className={GAME_PANEL_CLASS}>
              {line && (
                <DialogueBox
                  speaker={line.speaker}
                  visibleText={typewriter.visibleText}
                  onActivate={handleAdvance}
                />
              )}
              {interaction?.type === 'ollie' && !ollie && <OllieMeter onResult={startOllie} />}
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
                />
              )}
              <div className="[@media(pointer:fine)]:hidden">
                <TouchControls visible={Boolean(walk)} onDirectionChange={setDirection} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
