import { ReactNode } from 'react';
import { StageInput } from '@/presentation/story/engine/stage';

export type GameCanvasProps = StageInput & {
  underlay?: ReactNode;
  overlay?: ReactNode;
};
