import fs from 'node:fs';
import path from 'node:path';

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
