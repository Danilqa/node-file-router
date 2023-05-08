import { fileURLToPath } from 'node:url';

export function createTestRequestHandler(url) {
  const filePath = fileURLToPath(url)
    .replace(process.cwd(), '')
    .replace('/tests', '');

  return (req, res) => res.end({ req, filePath });
}

export function createTestRequestRunner(requestHandler) {
  return (url, onSuccess) => {
    requestHandler(
      { url, headers: { host: 'site' } },
      { end: onSuccess },
    );
  };
}
