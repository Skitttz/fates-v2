import { describe, expect, it } from 'vitest';
import { isJumpKey, walkDirectionFor } from './keyboard';

const key = (value: string) => new KeyboardEvent('keydown', { key: value });

describe('story keyboard', () => {
  it('jumps with space and the up arrow only', () => {
    expect(isJumpKey(key(' '))).toBe(true);
    expect(isJumpKey(key('ArrowUp'))).toBe(true);
    expect(isJumpKey(key('ArrowDown'))).toBe(false);
    expect(isJumpKey(key('Enter'))).toBe(false);
  });

  it('walks left with the left arrow and right with the right arrow', () => {
    expect(walkDirectionFor(key('ArrowLeft'))).toBe(-1);
    expect(walkDirectionFor(key('ArrowRight'))).toBe(1);
  });
});
