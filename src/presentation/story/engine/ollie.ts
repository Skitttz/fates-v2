import { OllieResult } from './story-reducer';

export const OLLIE_CYCLE_MS = 1200;
export const OLLIE_WINDOW = { min: 70, max: 90 };

export const meterValueAt = (elapsedMs: number): number =>
  Math.round(((Math.max(elapsedMs, 0) % OLLIE_CYCLE_MS) / OLLIE_CYCLE_MS) * 100);

export const ollieResultFor = (value: number): OllieResult =>
  value >= OLLIE_WINDOW.min && value <= OLLIE_WINDOW.max ? 'landed' : 'missed';
