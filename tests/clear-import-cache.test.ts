import { initFileRouter } from '../src/file-router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mocks = vi.hoisted(() => ({ isCommonJs: vi.fn() }));

vi.mock('/src/utils/env.utils', () => ({ isCommonJs: mocks.isCommonJs }));

describe('ClearImportCache', () => {
  const baseDir = `${__dirname}/api-clear-import-cache`;
  const testModulePath = `${__dirname}/api-clear-import-cache/fluid-route.ts`;
  const testModule = { id: '123' } as NodeModule;

  const testMiddlewareModulePath = `${__dirname}/api-clear-import-cache/middleware.ts`;
  const testMiddlewareModule = { id: '456' } as NodeModule;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#CommonJS', () => {
    beforeEach(() => {
      mocks.isCommonJs.mockReturnValue(true);
      require.cache[testModulePath] = testModule;
      require.cache[testMiddlewareModulePath] = testMiddlewareModule;
    });

    it('should not remove module from cache by default', async () => {
      await initFileRouter({ baseDir });

      expect(require.cache[testModulePath]).toBe(testModule);
      expect(require.cache[testMiddlewareModulePath]).toBe(
        testMiddlewareModule
      );
    });

    it('should remove cached module from cache when option is set', async () => {
      await initFileRouter({ baseDir, clearImportCache: true });

      expect(require.cache[testModulePath]).toBeUndefined();
      expect(require.cache[testMiddlewareModulePath]).toBeUndefined();
    });
  });

  describe('#ESModules', () => {
    beforeEach(() => {
      mocks.isCommonJs.mockReturnValue(false);
    });

    it('should not warn by default', async () => {
      const warnSpy = vi.spyOn(console, 'warn');

      await initFileRouter({ baseDir });

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn when current environment is not supported', async () => {
      const warnSpy = vi.spyOn(console, 'warn');

      await initFileRouter({ baseDir, clearImportCache: true });

      expect(warnSpy).toHaveBeenCalledWith(
        'Cache clearing is only supported for CommonJS modules'
      );
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });
});
