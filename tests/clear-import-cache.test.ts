import { initFileRouter } from '../src/file-router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  isCommonJs: vi.fn()
}));

vi.mock('/src/utils/env.utils', () => ({
  isCommonJs: mocks.isCommonJs
}));

describe('ClearImportCache', () => {
  describe('#CommonJS', () => {
    const testModulePath = `${__dirname}/api-clear-import-cache/fluid-route.ts`;
    const testModule = { id: '123' } as NodeModule;

    beforeEach(() => {
      vi.resetModules();
      require.cache[testModulePath] = testModule;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should not remove module from cache by default', async () => {
      mocks.isCommonJs.mockReturnValue(false);

      await initFileRouter({
        baseDir: `${__dirname}/api-clear-import-cache`
      });

      expect(require.cache[testModulePath]).toBe(testModule);
    });

    it('should remove cached module from cache when option is set', async () => {
      mocks.isCommonJs.mockReturnValue(true);

      await initFileRouter({
        baseDir: `${__dirname}/api-clear-import-cache`,
        clearImportCache: true
      });

      expect(require.cache[testModulePath]).toBeUndefined();
    });
  });

  describe('#ESModules', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should warn when current environment is not supported', async () => {
      mocks.isCommonJs.mockReturnValue(false);
      const warnSpy = vi.spyOn(console, 'warn');

      await initFileRouter({
        baseDir: `${__dirname}/api-clear-import-cache`,
        clearImportCache: true
      });

      expect(warnSpy).toHaveBeenCalledWith(
        'Cache clearing is only supported for CommonJS modules'
      );
      warnSpy.mockRestore();
    });
  });
});
