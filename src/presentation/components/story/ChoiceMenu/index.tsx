'use client';

import { KeyboardEvent, useRef, useState } from 'react';
import { NEXT_KEYS, PREVIOUS_KEYS } from './constants';
import { choiceMenuStyles } from './styles';
import { ChoiceMenuProps } from './types';

export function ChoiceMenu({ prompt, options, onChoose, onMove }: ChoiceMenuProps) {
  const [active, setActive] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const styles = choiceMenuStyles();

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
    <fieldset className={styles.root()}>
      <legend className={styles.legend()}>{prompt}</legend>
      <div className={styles.options()} onKeyDown={handleKeyDown}>
        {options.map((option, index) => {
          const first = index === 0;
          const tabIndex = index === active ? 0 : -1;

          return (
            <button
              key={option.id}
              ref={(element) => {
                buttonsRef.current[index] = element;
              }}
              type="button"
              autoFocus={first}
              tabIndex={tabIndex}
              onFocus={() => setActive(index)}
              onClick={() => onChoose(option.id)}
              className={styles.option()}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
