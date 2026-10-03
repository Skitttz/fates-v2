export const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select';

export const isActionKey = (event: KeyboardEvent): boolean =>
  event.code === 'Space' || event.key === 'Enter';

export const isArrowKey = (event: KeyboardEvent): boolean =>
  event.key === 'ArrowLeft' || event.key === 'ArrowRight';

export const isFromInteractiveElement = (event: KeyboardEvent): boolean => {
  const target = event.target as HTMLElement | null;
  return Boolean(target?.closest?.(INTERACTIVE_SELECTOR));
};

export const JUMP_KEYS: readonly string[] = [' ', 'ArrowUp'];

export const isJumpKey = (event: KeyboardEvent): boolean => JUMP_KEYS.includes(event.key);

export const walkDirectionFor = (event: KeyboardEvent): -1 | 1 =>
  event.key === 'ArrowLeft' ? -1 : 1;
