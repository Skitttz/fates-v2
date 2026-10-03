import { Skeleton } from '@/presentation/components/ui';
import { STORY_SKELETON_LABEL } from './constants';

export function StoryGameSkeleton() {
  return (
    <div role="status" aria-label={STORY_SKELETON_LABEL} className="flex flex-col gap-3">
      <Skeleton className="ml-auto h-9 w-40" />
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
  );
}
