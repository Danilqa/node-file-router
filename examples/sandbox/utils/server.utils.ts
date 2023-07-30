import type { IncomingMessage } from 'node:http';

export function parseJson<T = Record<string, string>>(
  request: IncomingMessage
): Promise<T> {
  return new Promise((resolve, reject) => {
    let data = '';

    request.on('data', (chunk) => {
      data += chunk;
    });

    request.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      } catch (e) {
        reject(e);
      }
    });
  });
}
