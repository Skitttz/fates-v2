import { StoryChoiceOptionModel } from '@/domain/models';

export interface ChoicePhotosProps {
  options: StoryChoiceOptionModel[];
  chosen: string | null;
}
