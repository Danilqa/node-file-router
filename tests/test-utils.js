import { fileURLToPath } from 'node:url';

export function createTestRequestHandler(url) {
  const filePath = fileURLToPath(url)
    .replace(process.cwd(), '')
    .replace('/tests', '');

  return function handler(req, res) {
    res.end(filePath);
  }
}
