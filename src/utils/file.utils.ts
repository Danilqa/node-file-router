import fs from 'node:fs';
import path from 'node:path';
import { isCommonJs } from './env.utils';

export function getFileWithExt(
  dir: string,
  filename: string
): string | undefined {
  const filesInDir = fs.readdirSync(dir);

  const matchingFiles = filesInDir.filter(
    (file) => path.parse(file).name === filename
  );

  if (!matchingFiles.length) {
    return;
  }

  const [firstMatch] = matchingFiles;

  return path.join(dir, firstMatch);
}

export function removeImportsCache(paths: string[]) {
  if (!isCommonJs()) {
    console.warn('Cache clearing is only supported for CommonJS modules');
    return;
  }

  paths.forEach((pathToRemove) => {
    delete require.cache[pathToRemove];
  });
}
