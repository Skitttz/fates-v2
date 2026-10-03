import { ChoiceMenuProps } from './types';

export function ChoiceMenu({ prompt, options, onChoose }: ChoiceMenuProps) {
  return (
    <fieldset className="flex flex-col gap-3 border-4 border-zinc-50 bg-black p-4">
      <legend className="px-2 font-pixel text-lg text-street-lime">{prompt}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            autoFocus={index === 0}
            onClick={() => onChoose(option.id)}
            className="min-h-12 touch-manipulation border-2 border-zinc-50 px-4 font-pixel text-base text-zinc-50 transition-colors hover:bg-street-lime hover:text-black focus-visible:bg-street-lime focus-visible:text-black"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
