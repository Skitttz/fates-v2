import { UnexpectedError } from '@/domain/errors';
import { STICKER_PLACES } from '@/domain/models/story-memory-model';
import {
  StoryActorEntrance,
  StoryActorModel,
  StoryChoiceOptionModel,
  StoryCondition,
  StoryInteractionModel,
  StoryLineModel,
  StoryModel,
  StoryObstacleModel,
  StoryOllieResult,
  StorySceneModel,
  StoryTransition,
  StoryWorld,
} from '@/domain/models';

const WORLDS: readonly StoryWorld[] = ['real', 'dream'];
const TRANSITIONS: readonly StoryTransition[] = ['cut', 'fade-to-dream', 'flash-to-real'];
const OLLIE_RESULTS: readonly StoryOllieResult[] = ['landed', 'missed'];
const ENTRANCES: readonly StoryActorEntrance[] = ['materialize'];

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
    ...(actor.entrance !== undefined ? { entrance: asOneOf(actor.entrance, ENTRANCES) } : {}),
  };
};

const adaptObstacle = (value: unknown): StoryObstacleModel => {
  const obstacle = asRecord(value);
  return { id: asText(obstacle.id), x: asNumber(obstacle.x) };
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
  const consequence = option.consequence === undefined ? null : asRecord(option.consequence);
  return {
    id: asText(option.id),
    label: asText(option.label),
    photo: asText(option.photo),
    outcome: asText(option.outcome),
    ...(consequence
      ? {
          consequence: {
            title: asText(consequence.title),
            text: asText(consequence.text),
            place: asOneOf(consequence.place, STICKER_PLACES),
          },
        }
      : {}),
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
        ...(interaction.obstacles !== undefined
          ? { obstacles: asList(interaction.obstacles).map(adaptObstacle) }
          : {}),
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
