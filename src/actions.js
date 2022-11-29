import { join } from 'path';
import { mergeDeepLeft } from 'ramda';
import { FsId } from '@rugo-vn/service';
import { NotFoundError } from '@rugo-vn/exception';

import { matchRoute } from './utils.js';

export const render = async function ({
  method, path, form, query, headers, cookies, params,
  routes, views, appId
}) {
  let viewModel;

  for (const view of views) {
    if (path.indexOf(view.use) !== 0) { continue; }

    path = join('/', path.substring(view.use.length));
    viewModel = view.model;
    break;
  }

  if (!routes && !viewModel) { throw new NotFoundError(); }

  if (!routes) {
    const { data: docs } = await this.call('model.find', { name: viewModel });
    routes =
      docs.map(item => ({ view: FsId(item._id).toPath() }))
        .filter(i => i.view[0] !== '_' && /(.js|.ejs)$/i.test(i.view))
        .map(route => {
          const routePath = route.view
            .replace(/(.js|.ejs)$/i, '')
            .replace(/index$/i, '')
            .replace(/\[(.*?)\]/g, ':$1');
          return {
            method: 'get',
            path: join('/', routePath),
            ...route
          };
        });
  }

  const route = await matchRoute(method, path, routes);

  if (!route) { throw new NotFoundError(); }

  const view = route.view;
  delete route.view;

  const result = await this.call('fx.run', {
    appId,
    path: view,
    model: viewModel,
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
