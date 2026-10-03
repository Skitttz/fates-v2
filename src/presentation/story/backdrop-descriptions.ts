export const BACKDROP_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'pista-dia': 'Pista de skate em Aracaju, no fim da tarde.',
  sonho: 'Uma Aracaju de sonho, desbotada e silenciosa.',
  'pista-noite': 'A mesma pista, já entrando na noite.',
};

export const describeBackdrop = (id: string): string => BACKDROP_DESCRIPTIONS[id] ?? '';
