export interface StoryEndingProps {
  epilogue: string;
  outcome: string | null;
  photoId: string | null;
  onRestart: () => void;
}
