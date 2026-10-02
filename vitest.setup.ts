import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Node 22+ expõe um localStorage próprio que sobrescreve o do jsdom
const { jsdom } = globalThis as unknown as { jsdom?: { window: Window } };
if (jsdom) {
  for (const key of ['localStorage', 'sessionStorage'] as const) {
    Object.defineProperty(globalThis, key, {
      value: jsdom.window[key],
      configurable: true,
      writable: true,
    });
  }
}

afterEach(() => {
  cleanup();
});
