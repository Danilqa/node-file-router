import path from 'node:path';
import fs from 'node:fs/promises';

import { FileRouterError } from '../utils/error.utils';
import { getType } from '../utils/common.utils';
import type { Dictionary } from '../types/dictionary';

export function validateFileFormat<M extends Dictionary<unknown>>(
  filePath: string,
  module: M
): M {
  const relativeFilePath = path.relative(process.cwd(), filePath);

  if (!('default' in module)) {
    throw new FileRouterError(
      `The file '${relativeFilePath}' does not contain a default export. It should export a default object or function.`
    );
  }

  const exportType = getType(module.default);
  if (!['object', 'function', 'array'].includes(exportType)) {
    throw new FileRouterError(
      `The file '${relativeFilePath}' is currently exporting ${exportType}. It should only export either a function, an array or an object.`
    );
  }

  return module;
}

export async function validateBaseDirExistence(filePath: string) {
  const normalizedPath = path.normalize(filePath);
  return fs.stat(normalizedPath).catch(() => {
    throw new FileRouterError(
      `The folder on the "${filePath}" isn't found. Create it or provide "baseDir" with the valid path.`
    );
  });
}
