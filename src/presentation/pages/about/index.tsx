import { Suspense } from 'react';
import { StoryGameSkeleton, StoryLoader } from '@/presentation/components/story';
import AboutLayout from './layout';
import { AboutProps } from './types';

export function About({ loadStory }: AboutProps) {
  return (
    <AboutLayout
      game={
        <Suspense fallback={<StoryGameSkeleton />}>
          <StoryLoader loadStory={loadStory} />
        </Suspense>
      }
    />
  );
}
