import { describe, expect, it } from 'vitest';
import { buttonVariants } from '@/presentation/components/ui';
import { tv } from './tv';

describe('tv', () => {
  it('lets a later class win over a conflicting one', () => {
    const box = tv({ base: 'px-4 text-zinc-300' });

    expect(box({ className: 'px-2 text-street-lime' })).toBe('px-2 text-street-lime');
  });

  it('keeps the custom hard shadows next to text and border colors', () => {
    const card = tv({ base: 'border-2 border-black text-black shadow-brutal' });

    expect(card({ className: 'hover:shadow-brutal-lime' }).split(' ')).toEqual(
      expect.arrayContaining(['shadow-brutal', 'hover:shadow-brutal-lime', 'border-black']),
    );
  });

  it('replaces one custom shadow with another', () => {
    const card = tv({ base: 'shadow-brutal' });

    expect(card({ className: 'shadow-brutal-sm' })).toBe('shadow-brutal-sm');
  });

  it('keeps a text size next to a custom text color', () => {
    const label = tv({ base: 'font-pixel text-xs text-street-lime' });

    expect(label()).toBe('font-pixel text-xs text-street-lime');
  });
});

describe('buttonVariants', () => {
  it.each([
    ['primary', 'bg-street-lime'],
    ['secondary', 'bg-street-orange'],
    ['success', 'bg-street-cyan'],
    ['outline', 'border-zinc-50'],
    ['ghost', 'text-zinc-300'],
  ] as const)('keeps the %s variant', (variant, expected) => {
    expect(buttonVariants({ variant }).split(' ')).toContain(expected);
  });

  it('defaults to the primary medium button', () => {
    const classes = buttonVariants().split(' ');

    expect(classes).toEqual(expect.arrayContaining(['bg-street-lime', 'h-11', 'px-6', 'text-sm']));
  });

  it('lets the caller override a conflicting class', () => {
    const classes = buttonVariants({
      variant: 'ghost',
      size: 'sm',
      className: 'px-2 text-street-lime',
    }).split(' ');

    expect(classes).toEqual(expect.arrayContaining(['px-2', 'text-street-lime']));
    expect(classes).not.toContain('px-4');
    expect(classes).not.toContain('text-zinc-300');
  });
});
