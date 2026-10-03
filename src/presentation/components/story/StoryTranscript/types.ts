import {
  StoryInteractionModel,
  StoryLineModel,
  StoryModel,
  StorySceneModel,
} from '@/domain/models';

export interface StoryTranscriptProps {
  story: StoryModel;
}

export interface TranscriptSceneProps {
  scene: StorySceneModel;
}

export interface TranscriptLineProps {
  line: StoryLineModel;
}

export interface TranscriptInteractionProps {
  interaction: StoryInteractionModel;
}
