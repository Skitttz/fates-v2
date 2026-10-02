import { GraffitiDrip } from './types';

/** lime, laranja, ciano, rosa e amarelo da paleta */
export const GRAFFITI_COLORS = ['#c4f82a', '#ff5a1f', '#5ce1e6', '#ff4fa3', '#ffd60a'];

/** tempo da passada + escorridos; enquanto roda, um novo hover não repicha */
export const GRAFFITI_DURATION_MS = 2600;

export const GRAFFITI_VIEWBOX = { width: 1000, height: 360 };

/** largura da máscara do spray: larga o bastante para cobrir a palavra inteira no fim da passada */
export const SWEEP_WIDTH = 2600;

export const GRAFFITI_TEXT = {
  x: 10,
  y: 286,
  fontSize: 320,
  textLength: 980,
};

/** escorridos saem um pouco acima da base das letras */
export const DRIP_START_Y = 270;

export const GRAFFITI_DRIPS: GraffitiDrip[] = [
  { x: 52, length: 46, width: 14, delay: 0.35, duration: 1.1 },
  { x: 236, length: 28, width: 10, delay: 0.55, duration: 0.9 },
  { x: 372, length: 58, width: 12, delay: 0.75, duration: 1.3 },
  { x: 500, length: 38, width: 16, delay: 0.95, duration: 1.0 },
  { x: 690, length: 22, width: 9, delay: 1.2, duration: 0.8 },
  { x: 752, length: 50, width: 13, delay: 1.3, duration: 1.2 },
  { x: 905, length: 34, width: 11, delay: 1.5, duration: 1.0 },
];
