import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('combina clases y deja ganar a la última clase conflictiva', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('descarta valores falsy', () => {
    expect(cn('block', undefined, null, false, 'hidden')).toBe('hidden');
  });
});
