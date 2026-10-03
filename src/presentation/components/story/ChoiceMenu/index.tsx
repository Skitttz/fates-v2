'use client';

import { KeyboardEvent, useRef, useState } from 'react';
import { NEXT_KEYS, PREVIOUS_KEYS } from './constants';
import { ChoiceMenuProps } from './types';

export function ChoiceMenu({ prompt, options, onChoose, onMove }: ChoiceMenuProps) {
  const [active, setActive] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const targetFor = (key: string): number | null => {
    const last = options.length - 1;
    if (PREVIOUS_KEYS.includes(key)) return active === 0 ? last : active - 1;
    if (NEXT_KEYS.includes(key)) return active === last ? 0 : active + 1;
    if (key === 'Home') return 0;
    if (key === 'End') return last;
    return null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = targetFor(event.key);
    if (target === null) return;
    event.preventDefault();
    buttonsRef.current[target]?.focus();
    if (target === active) return;
    setActive(target);
    onMove?.();
  };

  return (
    <fieldset className="flex flex-col gap-3 border-4 border-zinc-50 bg-black p-4">
      <legend className="px-2 font-pixel text-lg text-street-lime">{prompt}</legend>
      <div className="grid gap-2 sm:grid-cols-3" onKeyDown={handleKeyDown}>
        {options.map((option, index) => (
          <button
            key={option.id}
            ref={(element) => {
              buttonsRef.current[index] = element;
            }}
            type="button"
            autoFocus={index === 0}
            tabIndex={index === active ? 0 : -1}
            onFocus={() => setActive(index)}
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
