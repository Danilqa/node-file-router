import { URL } from 'node:url';
import path from 'node:path';
import { getRouteHandlers } from './lib/route-handler.js';

const __dirname = process.cwd();

const apiPath = path.join(__dirname, 'api');

const routeHandlers = await getRouteHandlers(apiPath);
const notFoundHandler = await import(path.join(__dirname, 'api/_404.js'))
  .catch(() => import('./lib/default-not-found.js'));

export function requestHandler(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  let matchedHandler = null;
  let queryParams = {};

  for (const [route, handlerData] of Object.entries(routeHandlers)) {
    if (handlerData.regex) {
      const match = handlerData.regex.exec(pathname);
      if (match) {
        matchedHandler = handlerData.handler;
        queryParams = { ...Object.fromEntries(parsedUrl.searchParams), ...match.groups };
        break;
      }
    } else if (route === pathname) {
      matchedHandler = handlerData.handler;
      queryParams = Object.fromEntries(parsedUrl.searchParams);
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
