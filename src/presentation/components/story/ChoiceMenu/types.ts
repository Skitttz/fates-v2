export interface ChoiceMenuOption {
  id: string;
  label: string;
}

export interface ChoiceMenuProps {
  prompt: string;
  options: ChoiceMenuOption[];
  onChoose: (id: string) => void;
  onMove?: () => void;
}
