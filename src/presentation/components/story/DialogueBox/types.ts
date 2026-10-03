export interface DialogueBoxProps {
  speaker: string | null;
  text: string;
  visibleText: string;
  onActivate: () => void;
}
