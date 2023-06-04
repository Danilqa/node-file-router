import { Dictionary } from '../types/dictionary';
import { FileRouterError } from '../utils/error.utils';

export function validateFileFormat<M extends Dictionary<unknown>>(path: string, module: M): M {
  if (!module.default) {
    throw new FileRouterError(`${path} does not export a default value. \nLink: https://google.com`);
  }

  if (typeof module.default !== 'object' && typeof module.default !== 'function' || Array.isArray(module.default)) {
    throw new FileRouterError(`${path} content is not format`);
  }

  return module;
}
