'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useSound } from '@/presentation/contexts/sound';
import {
  useOllieAnimation,
  usePlacing,
  useRestartFocus,
  useSceneTransition,
  useStoryFlow,
  useStoryKeyboard,
  useStorySounds,
  useStoryWalk,
} from '@/presentation/hooks/story';
import { useGameFocus } from '@/presentation/hooks/useGameFocus';
import { usePrefersReducedMotion } from '@/presentation/hooks/usePrefersReducedMotion';
import { useTypewriter } from '@/presentation/hooks/useTypewriter';
import { describeBackdrop } from '@/presentation/story/backdrop-descriptions';
import { GLOW_ACTOR } from '@/presentation/story/engine/constants';
import { choiceOutcome } from '@/presentation/story/engine/story-reducer';
import { photoForChoice } from '@/presentation/story/photos';
import { SOUNDS } from '@/presentation/story/sounds';
import { lineAnnouncement, nextMode, storyEffect, StoryMode } from '@/presentation/story/view';
import { ChoiceMenu } from '../ChoiceMenu';
import { ChoicePhotos } from '../ChoicePhotos';
import { DialogueBox } from '../DialogueBox';
import { GameCanvas } from '../GameCanvas';
import { OllieMeter } from '../OllieMeter';
import { StickerStamp } from '../StickerStamp';
import { StoryEnding } from '../StoryEnding';
import { StoryToolbar } from '../StoryToolbar';
import { StoryTranscript } from '../StoryTranscript';
import { TouchControls } from '../TouchControls';
import { WalkHint } from '../WalkHint';
import { WalkIntro } from '../WalkIntro';
import { DIALOGUE_SELECTOR, STORY_GAME_LABELS } from './constants';
import { storyGameStyles } from './styles';
import { StoryGameProps } from './types';

export function StoryGame({ story }: StoryGameProps) {
  const { state, moment, actions } = useStoryFlow(story);
  const { scene, line, speaker, walk, choice, ended, inDialogue } = moment;
  const [mode, setMode] = useState<StoryMode>('game');
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { player, available, enabled, setEnabled } = useSound();
  const inGame = mode === 'game';
  const onWalk = Boolean(walk);
  const animated = !reducedMotion;
  const holdingKeys = useGameFocus(sectionRef, inGame);
  const typewriter = useTypewriter(line?.text ?? '', reducedMotion);
  const { visibleText, done: typed, complete: completeTyping } = typewriter;

  const walking = useStoryWalk({
    player,
    walk,
    actor: moment.walkActor,
    walkKey: moment.walkKey,
    enabled: inGame,
    reducedMotion,
    onArrive: actions.completeWalk,
  });
  const { steer } = walking;

  const ollie = useOllieAnimation({ player, reducedMotion, onFinish: actions.finishOllie });
  const { cancel: cancelOllie } = ollie;
  const sticker = usePlacing({ player, reducedMotion, onFinish: actions.finishPlacing });
  const { placing, cancel: cancelPlacing } = sticker;

  const transition = useSceneTransition({
    phase: state.phase,
    scene,
    sceneIndex: state.sceneIndex,
    reducedMotion,
    onEnd: actions.endTransition,
  });

  const handleAdvance = useCallback(() => {
    if (typed) actions.nextLine();
    else completeTyping();
  }, [actions, completeTyping, typed]);

  useStorySounds({
    player,
    world: ended ? 'real' : scene.world,
    rolling: walking.rolling,
    transition: transition?.kind ?? null,
    sceneIndex: state.sceneIndex,
    speaker,
    typedCount: visibleText.length,
    typing: !typed,
  });

  useStoryKeyboard({
    active: inGame,
    holding: holdingKeys,
    walking: onWalk,
    dialogue: inDialogue,
    onDirection: steer,
    onJump: walking.jump,
    onAdvance: handleAdvance,
  });

  const step = `${state.phase}:${state.sceneIndex}:${state.lineIndex}`;
  const focusDialogueNext = useRestartFocus(sectionRef, DIALOGUE_SELECTOR, inDialogue, step);

  const skip = useCallback(() => {
    const pending = cancelPlacing();
    cancelOllie();
    actions.skip(pending ?? undefined);
  }, [actions, cancelOllie, cancelPlacing]);

  const restart = useCallback(() => {
    cancelPlacing();
    cancelOllie();
    steer(0);
    focusDialogueNext();
    actions.restart();
  }, [actions, cancelOllie, cancelPlacing, focusDialogueNext, steer]);

  const toggleMode = useCallback(() => setMode(nextMode), []);
  const playMenuSelect = useCallback(() => player.play(SOUNDS.menuSelect), [player]);

  const soundToggle = useMemo(() => {
    if (!available) return undefined;
    return { enabled, onToggle: () => setEnabled(!enabled) };
  }, [available, enabled, setEnabled]);

  const underlay = useMemo(() => {
    if (!choice) return undefined;
    return <ChoicePhotos options={choice.options} chosen={placing} />;
  }, [choice, placing]);

  const stamp = placing ? <StickerStamp progress={sticker.progress} /> : undefined;
  const introCard = walking.introVisible ? <WalkIntro animated={animated} /> : undefined;
  const overlay = stamp ?? introCard;
  const emphasis = walking.introVisible && animated ? GLOW_ACTOR : undefined;
  const effect = storyEffect({
    placing,
    placingProgress: sticker.progress,
    ollie: ollie.ollie,
    ollieProgress: ollie.progress,
  });
  const showStage = inGame && !ended;
  const showEnding = inGame && ended;
  const showOllieMeter = moment.awaitsOllie && !ollie.ollie;
  const openChoice = placing ? undefined : choice;
  const styles = storyGameStyles();

  return (
    <section ref={sectionRef} aria-label={STORY_GAME_LABELS.region} className={styles.root()}>
      <p role="status" aria-label={STORY_GAME_LABELS.currentLine} className={styles.status()}>
        {lineAnnouncement(mode, line)}
      </p>
      <StoryToolbar
        mode={mode}
        ended={ended}
        sound={soundToggle}
        onSkip={skip}
        onToggleMode={toggleMode}
      />

      {!inGame && <StoryTranscript story={story} />}

      {showEnding && (
        <StoryEnding
          epilogue={story.epilogue}
          outcome={choiceOutcome(story, state)}
          photoId={photoForChoice(story, state.choice)}
          onRestart={restart}
        />
      )}

      {showStage && (
        <div className={styles.stage()}>
          <p className={styles.backdrop()} aria-live="polite">
            {describeBackdrop(scene.backdrop)}
          </p>
          <div className={styles.layout()}>
            <GameCanvas
              scene={scene}
              animated={animated}
              speaker={speaker}
              actorOverrides={walking.actorOverrides}
              effect={effect}
              overlay={overlay}
              emphasis={emphasis}
              underlay={underlay}
              transition={transition}
            />
            <div className={styles.panel()}>
              {line && (
                <DialogueBox
                  speaker={speaker}
                  visibleText={visibleText}
                  onActivate={handleAdvance}
                />
              )}
              {showOllieMeter && <OllieMeter onResult={ollie.start} listening={holdingKeys} />}
              {onWalk && <WalkHint />}
              {openChoice && (
                <ChoiceMenu
                  prompt={openChoice.prompt}
                  options={openChoice.options}
                  onChoose={sticker.choose}
                  onMove={playMenuSelect}
                />
              )}
              <div className={styles.touch()}>
                <TouchControls visible={onWalk} onDirectionChange={steer} onJump={walking.jump} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
