import { URL } from 'node:url';
import path from 'node:path';
import { getRouteHandlers } from './lib/route-handler.js';
import { replaceObjectKeys } from './utils/object.utils.js';
import { decodeSlugParam } from './lib/slug-param/slug-param.js';

export async function withFilesRouter({ baseDir = '/api' } = {}) {
  const __dirname = process.cwd();

  const basePath = path.join(__dirname, baseDir);

  const routeHandlers = await getRouteHandlers(basePath);
  const notFoundHandler = await import(path.join(basePath, '_404.js'))
    .catch(() => import('./lib/default-not-found.js'));

  return function requestHandler(req, res) {
    const parsedUrl = new URL(req.url, `https://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    let matchedHandler = null;
    let queryParams = {};

    for (const [route, handlerData] of Object.entries(routeHandlers)) {
      const match = handlerData.regex.exec(pathname);
      if (match) {
        matchedHandler = handlerData.handler;
        const decodedGroups = replaceObjectKeys(match.groups, decodeSlugParam);
        queryParams = { ...Object.fromEntries(parsedUrl.searchParams), ...decodedGroups };
        break;
      }
    }

    if (matchedHandler) {
      req.query = queryParams;
      matchedHandler(req, res);
    } else {
      notFoundHandler.default(req, res);
    }
  }
}
