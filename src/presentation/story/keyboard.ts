export const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select';

export const isActionKey = (event: KeyboardEvent): boolean =>
  event.code === 'Space' || event.key === 'Enter';

export const isArrowKey = (event: KeyboardEvent): boolean =>
  event.key === 'ArrowLeft' || event.key === 'ArrowRight';

export const isFromInteractiveElement = (event: KeyboardEvent): boolean => {
  const target = event.target as HTMLElement | null;
  return Boolean(target?.closest?.(INTERACTIVE_SELECTOR));
};
