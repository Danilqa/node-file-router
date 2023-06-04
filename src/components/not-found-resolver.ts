import { getFileWithExt } from '../utils/file.utils';

export function resolveNotFoundHandler(basePath: string) {
  const userHandler = getFileWithExt(basePath, '_404');
  if (userHandler) {
    return import(userHandler).then(file => file.default);
  }
}
