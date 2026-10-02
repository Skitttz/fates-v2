'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { QuantityStepperProps } from './types';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Quantidade',
}: QuantityStepperProps) {
  const buttonClass =
    'grid size-10 place-items-center transition-colors hover:bg-street-lime hover:text-black disabled:pointer-events-none disabled:opacity-30';

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex w-fit items-center border-2 border-zinc-700"
    >
      <button
        type="button"
        aria-label="Diminuir quantidade"
        className={buttonClass}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon className="size-4" />
      </button>
      <span aria-live="polite" className="w-10 text-center font-display text-lg">
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        className={buttonClass}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
