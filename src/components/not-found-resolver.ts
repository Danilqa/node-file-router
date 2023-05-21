import { getFileWithExt } from '../utils/file.utils';
import * as defaultNotFoundHandler from './default-not-found';

export function resolveNotFoundHandler(basePath: string) {
  const userHandler = getFileWithExt(basePath, '_404');
  if (userHandler) {
    return import(userHandler);
  }

  return Promise.resolve(defaultNotFoundHandler);
}
