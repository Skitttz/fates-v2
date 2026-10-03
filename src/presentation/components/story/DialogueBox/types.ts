export interface DialogueBoxProps {
  speaker: string | null;
  visibleText: string;
  onActivate: () => void;
}
