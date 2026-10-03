import { RenderInput } from '@/presentation/story/engine/renderer';

export type GameCanvasProps = Omit<RenderInput, 'timeMs'>;
