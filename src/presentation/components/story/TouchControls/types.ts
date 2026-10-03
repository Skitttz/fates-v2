import { WalkDirection } from '@/presentation/hooks/useWalk';

export interface TouchControlsProps {
  visible: boolean;
  active?: boolean;
  onDirectionChange: (direction: WalkDirection) => void;
  onJump: () => void;
}
