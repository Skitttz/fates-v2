import { UnexpectedError } from '@/domain/errors';
import {
  StoryActorModel,
  StoryChoiceOptionModel,
  StoryCondition,
  StoryInteractionModel,
  StoryLineModel,
  StoryModel,
  StoryOllieResult,
  StorySceneModel,
  StoryTransition,
  StoryWorld,
} from '@/domain/models';

const WORLDS: readonly StoryWorld[] = ['real', 'dream'];
const TRANSITIONS: readonly StoryTransition[] = ['cut', 'fade-to-dream', 'flash-to-real'];
const OLLIE_RESULTS: readonly StoryOllieResult[] = ['landed', 'missed'];

const invalid = (): never => {
  throw new UnexpectedError();
};

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : invalid();

const asText = (value: unknown): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : invalid();

const asNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : invalid();

const asList = (value: unknown): unknown[] => (Array.isArray(value) ? value : invalid());

const asOneOf = <T extends string>(value: unknown, allowed: readonly T[]): T =>
  allowed.includes(value as T) ? (value as T) : invalid();

const adaptActor = (value: unknown): StoryActorModel => {
  const actor = asRecord(value);
  return {
    id: asText(actor.id),
    x: asNumber(actor.x),
    y: asNumber(actor.y),
    pose: asText(actor.pose),
  };
};

const adaptCondition = (value: unknown): StoryCondition => ({
  ollie: asOneOf(asRecord(value).ollie, OLLIE_RESULTS),
});

const adaptLine = (value: unknown): StoryLineModel => {
  const line = asRecord(value);
  return {
    speaker: line.speaker === null ? null : asText(line.speaker),
    text: asText(line.text),
    ...(line.when !== undefined ? { when: adaptCondition(line.when) } : {}),
  };
};

const adaptOption = (value: unknown): StoryChoiceOptionModel => {
  const option = asRecord(value);
  return {
    id: asText(option.id),
    label: asText(option.label),
    photo: asText(option.photo),
    outcome: asText(option.outcome),
  };
};

const adaptInteraction = (value: unknown): StoryInteractionModel => {
  const interaction = asRecord(value);

  switch (interaction.type) {
    case 'ollie':
      return { type: 'ollie' };
    case 'walk-to':
      return {
        type: 'walk-to',
        actor: asText(interaction.actor),
        targetX: asNumber(interaction.targetX),
      };
    case 'choice': {
      const options = asList(interaction.options).map(adaptOption);
      if (options.length === 0) invalid();
      return { type: 'choice', prompt: asText(interaction.prompt), options };
    }
    default:
      return invalid();
  }
};

const adaptScene = (value: unknown): StorySceneModel => {
  const scene = asRecord(value);
  const actors = asList(scene.actors).map(adaptActor);
  const interaction =
    scene.interaction !== undefined ? adaptInteraction(scene.interaction) : undefined;

  if (interaction?.type === 'walk-to' && !actors.some(({ id }) => id === interaction.actor)) {
    invalid();
  }

  return {
    id: asText(scene.id),
    world: asOneOf(scene.world, WORLDS),
    backdrop: asText(scene.backdrop),
    actors,
    lines: asList(scene.lines).map(adaptLine),
    ...(interaction ? { interaction } : {}),
    ...(scene.transitionIn !== undefined
      ? { transitionIn: asOneOf(scene.transitionIn, TRANSITIONS) }
      : {}),
  };
};

export const adaptStory = (value: unknown): StoryModel => {
  const story = asRecord(value);
  const scenes = asList(story.scenes).map(adaptScene);
  if (scenes.length === 0) invalid();

  return {
    id: asText(story.id),
    title: asText(story.title),
    scenes,
    epilogue: asText(story.epilogue),
  };
};
