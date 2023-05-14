import { decodeSlugParam, encodeSlugParam } from '../src/lib/slug-param/slug-param';
import { describe, expect, it } from 'vitest';

describe('SlugParam', () => {

  it('should encode a slug param', () => {
    expect(encodeSlugParam('slugId')).toMatch(/^slugId_\d{8}$/);
  });

  it('should decode a slug param', () => {
    expect(decodeSlugParam('slugId_12345678')).toBe('slugId');
  });
});
