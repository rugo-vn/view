import { match } from 'path-to-regexp';
import { mergeDeepLeft } from 'ramda';

export const matchRoute = (method, path, routes) => {
  const reqMethod = method.toLowerCase();
  const reqUrl = path;

  for (const route of routes) {
    if (route.method !== 'all' && route.method !== reqMethod) { continue; }

    const fn = match(route.path, { decode: decodeURIComponent });
    const rel = fn(reqUrl);

    if (!rel) { continue; }

    return {
      method: reqMethod,
      path: reqUrl,
      view: route.view,
      params: mergeDeepLeft(rel.params, route.params || {})
    };
  }
};
