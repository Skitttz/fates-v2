import { OptionGroupProps } from './types';

export function OptionGroup({ legend, name, options, value, onChange }: OptionGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-zinc-400">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className="grid h-11 min-w-11 place-items-center border-2 border-zinc-700 px-3 font-display text-sm uppercase transition-all hover:border-zinc-50 peer-checked:-translate-y-0.5 peer-checked:border-black peer-checked:bg-street-lime peer-checked:text-black peer-checked:shadow-brutal-sm peer-focus-visible:ring-2 peer-focus-visible:ring-street-lime">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
