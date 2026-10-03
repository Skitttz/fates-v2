import { ADESIVO } from './adesivo';
import { CAIXOTE } from './caixote';
import { CONE } from './cone';
import { PAULO } from './paulo';
import { POSTE } from './poste';
import { PRANCHA } from './prancha';
import { SpriteSheet } from './types';
import { URSO } from './urso';
import { VISITANTE } from './visitante';

export const SPRITE_SHEETS: Readonly<Record<string, SpriteSheet>> = {
  paulo: PAULO,
  urso: URSO,
  caixote: CAIXOTE,
  adesivo: ADESIVO,
  prancha: PRANCHA,
  cone: CONE,
  poste: POSTE,
  visitante: VISITANTE,
};
