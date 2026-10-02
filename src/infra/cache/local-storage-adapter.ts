import { GetStorage, SetStorage } from '@/data/protocols/cache';

export class LocalStorageAdapter implements GetStorage, SetStorage {
  get<T = unknown>(key: string): T | null {
    const storage = this.getStorage();
    if (!storage) return null;

    try {
      const value = storage.getItem(key);
      return value === null ? null : (JSON.parse(value) as T);
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      if (value === null || value === undefined) {
        storage.removeItem(key);
        return;
      }
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // storage cheio ou bloqueado (modo privado): ignora silenciosamente
    }
  }

  private getStorage(): Storage | null {
    try {
      return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
      return null;
    }
  }
}
