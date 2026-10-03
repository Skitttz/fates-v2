export const STORY_GAME_LABELS = {
  region: 'História da Fates',
  walkHint: 'Leve o Paulo até o brilho.',
  walkKeysHint: 'Use ← e → para andar.',
};

export const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select';

export const GAME_LAYOUT_CLASS =
  'relative grid gap-3 [@media(orientation:landscape)_and_(max-height:500px)]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] [@media(orientation:landscape)_and_(max-height:500px)]:items-start';

export const GAME_PANEL_CLASS =
  'flex flex-col gap-3 [@media(pointer:fine)_and_(min-width:768px)]:absolute [@media(pointer:fine)_and_(min-width:768px)]:inset-x-4 [@media(pointer:fine)_and_(min-width:768px)]:bottom-4';
