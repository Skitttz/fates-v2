export interface GetStorage {
  get: <T = unknown>(key: string) => T | null;
}

export interface SetStorage {
  set: (key: string, value: unknown) => void;
}
