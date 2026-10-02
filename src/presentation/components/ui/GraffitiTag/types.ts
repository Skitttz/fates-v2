export interface GraffitiTagProps {
  text: string;
  className?: string;
}

export type GraffitiDrip = {
  x: number;
  length: number;
  width: number;
  /** segundos após o início da passada do spray */
  delay: number;
  duration: number;
};

export type GraffitiLayers = {
  /** tinta da pichação anterior, já seca */
  under: string | null;
  /** tinta sendo aplicada agora */
  top: string | null;
  run: number;
};
