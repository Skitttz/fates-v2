import { OllieResult } from '@/presentation/story/engine/story-reducer';

export interface OllieMeterProps {
  onResult: (result: OllieResult) => void;
}
