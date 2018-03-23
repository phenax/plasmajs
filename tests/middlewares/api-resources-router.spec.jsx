import React from 'react';

import { expect } from 'chai';

import constant from 'lodash/constant';

import { renderComponent } from '../../lib/helper';

import { Resource, Action } from '../../middlewares/APIResourcesRouter';

import { mockCtx, createController } from '../../lib/testHelpers.jsx';

describe('API Resources Router', () => {
  describe('with simple handler function routing', () => {
    it('should call the correct handler', () => {
      let handerFnWasCalled = false;
      const handlerFn = () => {
        handerFnWasCalled = true;
      };

      const ctx = mockCtx('/users', { method: 'get' });

      renderComponent(() => (
        <Resource {...ctx} name="users">
          <Action path="/" method="GET" handler={handlerFn} />
          <Action path="/view" method="GET" handler={constant(null)} />
        </Resource>
      ));

      expect(handerFnWasCalled).to.be.true;
    });

    it('should not match when http method is incorrect', () => {
      let handerFnWasCalled = false;
      const handlerFn = () => {
        handerFnWasCalled = true;
      };

      const ctx = mockCtx('/users/add', { method: 'get' });

      renderComponent(() => (
        <Resource {...ctx} name="users">
          <Action path="/" method="GET" handler={constant(null)} />
          <Action path="/add" method="POST" handler={handlerFn} />
        </Resource>
      ));

      expect(handerFnWasCalled).to.be.false;
    });

    it('should call nothing when nothing matches', () => {
      let handerFnWasCalled = false;
      const handlerFn = () => {
        handerFnWasCalled = true;
      };

      const ctx = mockCtx('/uk09kse', { method: 'get' });

      renderComponent(() => (
        <Resource {...ctx} name="posts">
          <Action path="/" method="GET" handler={handlerFn} />
          <Action
            path="/something-else"
            method="GET"
            handler={constant(null)}
          />
        </Resource>
      ));

      expect(handerFnWasCalled).to.be.false;
    });
  });

  describe('with controller class', () => {
    it('should call the correct decorated action in the controller', () => {
      let handerFnWasCalled = false;
      const handlerFn = () => {
        handerFnWasCalled = true;
      };

      const ctx = mockCtx('/users', { method: 'get' });

      renderComponent(() => (
        <Resource
          {...ctx}
          name="users"
          controller={createController({ index: handlerFn })}
        />
      ));

      expect(handerFnWasCalled).to.be.true;
    });

    it('should call handle multiple http methods', () => {
      let handerFnWasCalled = false;
      const handlerFn = () => {
        handerFnWasCalled = true;
      };

      let ctx = null;

      handerFnWasCalled = false;
      ctx = mockCtx('/users', { method: 'get' });
      renderComponent(() => (
        <Resource
          {...ctx}
          name="users"
          controller={createController({ index: handlerFn })}
        />
      ));

      expect(handerFnWasCalled).to.be.true;

      handerFnWasCalled = false;
      ctx = mockCtx('/users', { method: 'post' });
      renderComponent(() => (
        <Resource
          {...ctx}
          name="users"
          controller={createController({ index: handlerFn })}
        />
      ));

      expect(handerFnWasCalled).to.be.true;

      handerFnWasCalled = false;
      ctx = mockCtx('/users', { method: 'put' });
      renderComponent(() => (
        <Resource
          {...ctx}
          name="users"
          controller={createController({ index: handlerFn })}
        />
      ));

      expect(handerFnWasCalled).to.be.false;
    });
  });

  // Tests for controller that return a promise
  // describe('With controllers that return a Promise', () => {

  // });
});
