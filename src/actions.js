import { RugoException } from '@rugo-vn/service';
import { mergeDeepLeft } from 'ramda';

import { matchRoute } from './utils.js';
import { NotFoundError } from './exceptions.js';

export const render = async function ({
  method, path, form, query, headers, cookies, params,
  routes, viewSchema
}) {
  if (!routes/* && !viewSchema */)
    throw new NotFoundError();

  const route = await matchRoute(method, path, routes);

  if (!route) { throw new NotFoundError(); }

  const view = route.view;
  delete route.view;

  const result = await this.call('fx.run', {
    path: view,
    schema: viewSchema,
    locals: {
      params: mergeDeepLeft(route.params, params || {}),
      route: mergeDeepLeft({
        form, query, headers, cookies
      }, route)
    }
  });

  return typeof result === 'string'
    ? {
        data: result
      }
    : result;
};
