export interface OptionGroupProps {
  legend: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}
