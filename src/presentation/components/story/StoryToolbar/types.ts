export type StoryMode = 'game' | 'text';

export interface StoryToolbarProps {
  mode: StoryMode;
  ended: boolean;
  onSkip: () => void;
  onToggleMode: () => void;
}
