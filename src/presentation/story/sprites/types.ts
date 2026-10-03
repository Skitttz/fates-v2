export type SpriteFrame = readonly string[];

export type SpritePalette = Readonly<Record<string, string>>;

export type SpriteDefinition = {
  palette: SpritePalette;
  frames: readonly SpriteFrame[];
  fps: number;
};

export type SpriteSheet = Readonly<Record<string, SpriteDefinition>>;
