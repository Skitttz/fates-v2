import { ErrorState } from '@/presentation/components/feedback';
import { getErrorMessage } from '@/presentation/utils/getErrorMessage';
import { StoryGame } from '../StoryGame';
import { StoryLoaderProps } from './types';

export async function StoryLoader({ loadStory }: StoryLoaderProps) {
  try {
    const story = await loadStory.load();
    return <StoryGame story={story} />;
  } catch (error) {
    return <ErrorState message={getErrorMessage(error)} />;
  }
}
