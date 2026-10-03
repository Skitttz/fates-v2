export type StoryMode = 'game' | 'text';

export interface StorySoundToggle {
  enabled: boolean;
  onToggle: () => void;
}

export interface StoryToolbarProps {
  mode: StoryMode;
  ended: boolean;
  sound?: StorySoundToggle;
  onSkip: () => void;
  onToggleMode: () => void;
}
