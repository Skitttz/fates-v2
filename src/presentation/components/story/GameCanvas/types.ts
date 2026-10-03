import { RenderInput } from '@/presentation/story/engine/types';

export type GameCanvasProps = Omit<RenderInput, 'timeMs' | 'sceneTimeMs' | 'particles'>;
