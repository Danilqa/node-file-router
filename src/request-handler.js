import { URL } from 'node:url';
import path from 'node:path';
import { getRouteHandlers } from './lib/route-handler.js';
import { replaceObjectKeys } from './utils/object.utils.js';
import { decodeSlugParam } from './lib/slug-param/slug-param.js';

export async function withFilesRouter({ baseDir = '/api' } = {}) {
  const basePath = path.join(process.cwd(), baseDir);

  const routeHandlers = await getRouteHandlers(basePath);
  const notFoundHandler = await import(path.join(basePath, '_404.js'))
    .catch(() => import('./lib/default-not-found.js'));

  return function requestHandler(req, res) {
    const parsedUrl = new URL(req.url, `https://${req.headers.host}`);
    const { pathname } = parsedUrl;

    const matchedRoute = Object.values(routeHandlers).find(({ regex }) => regex.test(pathname));

    if (matchedRoute) {
      const { regex, handler } = matchedRoute;
      const match = regex.exec(pathname);
      const decodedGroups = replaceObjectKeys(match.groups, decodeSlugParam);
      req.query = { ...Object.fromEntries(parsedUrl.searchParams), ...decodedGroups };
      handler(req, res);
    } else {
      notFoundHandler.default(req, res);
    }
  }
}
