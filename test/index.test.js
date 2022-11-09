/* eslint-disable */

import { createBroker } from '@rugo-vn/service';
import { assert, expect } from 'chai';

const DEFAULT_ARGS = {
  views: [
    { use: '/', model: 'foo' },
  ],
  routes: [
    { method: 'get', path: '/', view: 'home.js', params: { ok: 'bye' } },
    { method: 'patch', path: '/:firstName-:lastName.html', view: 'name.ejs', params: { lastName: 'Joe' } },
    { method: 'post', path: '/square/[firstName]-[lastName].html', view: 'name.ejs', params: { lastName: 'Joe' } },
  ],
};

describe('view test', () => {
  let broker;

  before(async () => {
    // create broker
    broker = createBroker({
      _services: [
        './src/index.js',
        './test/fx.service.js',
      ],
    });

    await broker.loadServices();
    await broker.start();
  });

  after(async () => {
    await broker.close();
  });

  it('should run', async () => {
    const res = await broker.call('view.render', {
      method: 'get',
      path: '/',
      ...DEFAULT_ARGS,
    });
    expect(res.data).to.has.property('path', 'home.js');
  });

  it('should not found', async () => {
    try {
      await broker.call('view.render', {
        method: 'get',
        path: '/not-found',
        ...DEFAULT_ARGS,
      });
    } catch(errs) {
      expect(errs[0]).to.has.property('message', 'Not found');
      expect(errs[0]).to.has.property('status', 404);
      return;
    }

    assert.fail('should error');
  });

  it('should merge params', async () => {
    const res = await broker.call('view.render', {
      method: 'patch',
      path: '/foo-bar.html',
      ...DEFAULT_ARGS,
    });

    expect(res.data.locals.params).to.has.property('firstName', 'foo');
    expect(res.data.locals.params).to.has.property('lastName', 'bar');
  });

  // it('should replace square bracket', async () => {
  //   const res = await broker.call('view.render', {
  //     method: 'post',
  //     path: '/square/foo-bar.html',
  //     ...DEFAULT_ARGS,
  //   });

  //   expect(res.data.locals.params).to.has.property('firstName', 'foo');
  //   expect(res.data.locals.params).to.has.property('lastName', 'bar');
  // });
});