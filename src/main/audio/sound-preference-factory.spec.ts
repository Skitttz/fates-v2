import { beforeEach, describe, expect, it } from 'vitest';
import { makeSoundPreference } from './sound-preference-factory';

describe('makeSoundPreference', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('has no choice until the visitor makes one', () => {
    expect(makeSoundPreference().load()).toBeNull();
  });

  it('remembers the choice between visits', () => {
    makeSoundPreference().save(false);

    expect(makeSoundPreference().load()).toBe(false);
  });
});
