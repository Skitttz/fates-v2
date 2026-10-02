import { GetStorage, SetStorage } from '../protocols/cache';

export class StorageSpy implements GetStorage, SetStorage {
  values = new Map<string, unknown>();

  get<T = unknown>(key: string): T | null {
    return (this.values.get(key) as T) ?? null;
  }

  set(key: string, value: unknown): void {
    if (value === null || value === undefined) {
      this.values.delete(key);
      return;
    }
    this.values.set(key, value);
  }
}
