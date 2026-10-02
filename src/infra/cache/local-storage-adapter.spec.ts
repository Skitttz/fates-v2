import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStorageAdapter } from './local-storage-adapter';

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('serializes values on set and parses them on get', () => {
    const sut = new LocalStorageAdapter();

    sut.set('key', { a: 1 });

    expect(localStorage.getItem('key')).toBe('{"a":1}');
    expect(sut.get('key')).toEqual({ a: 1 });
  });

  it('removes the key when value is null', () => {
    const sut = new LocalStorageAdapter();
    localStorage.setItem('key', '"value"');

    sut.set('key', null);

    expect(localStorage.getItem('key')).toBeNull();
  });

  it('returns null for missing or invalid json values', () => {
    const sut = new LocalStorageAdapter();
    localStorage.setItem('broken', '{not json');

    expect(sut.get('missing')).toBeNull();
    expect(sut.get('broken')).toBeNull();
  });
});
