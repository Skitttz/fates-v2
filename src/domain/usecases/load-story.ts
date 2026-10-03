import { StoryModel } from '../models';

export interface LoadStory {
  load: () => Promise<LoadStory.Model>;
}

export namespace LoadStory {
  export type Model = StoryModel;
}
