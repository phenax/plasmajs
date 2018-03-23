import React from 'react';

import { expect } from 'chai';

import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import noop from 'lodash/noop';

import { Route } from '../../router/server';
import { MockHistoryAPI } from '../../router/history/MockHistoryAPI.jsx';

import { renderComponent } from '../../lib/helper';
import * as route from '../../lib/testHelpers.jsx';

describe('Router', () => {
  describe('Configuration', () => {
    let router;

    beforeEach(() => {
      router = route.getRouter('/')();
    });

    it('should have the history api', () => {
      expect(router.props.history).to.exist;
      expect(router.props.history).to.be.instanceof(MockHistoryAPI);
    });

    it('should have all routes', () => {
      expect(router.props.children).to.not.be.empty;

      forEach(router.props.children, child => {
        expect(child).to.exist;

        expect(child.type).to.eql(<Route component={noop} />.type);
      });
    });
    it('should be able to unmount without throwing errors', () => {
      expect(router.componentWillUnmount).not.to.throw;
    });
    it('should have all the routes configured correctly', () => {
      forEach(router.props.children, child => {
        expect(child.props.component).to.exist;
        expect(child.props.component).to.be.instanceof(Function);

        if (!child.props.errorHandler) {
          expect(child.props.path).to.satisfy(path => {
            if (isString(path) || (isObject(path) && 'test' in path))
              return true;
            return false;
          });
        }
      });
    });
  });

  describe('Routing', () => {
    it('should render match for path as a string', () => {
      const markup = renderComponent(route.getRouter('/'));

      // Rendered route should be the index route
      expect(markup).to.eql(route.indexString);
    });

    it('should render match for path as a regex', () => {
      const markup = renderComponent(route.getRouter('/about'));

      // Rendered route should be the about route
      expect(markup).to.eql(route.aboutString);
    });

    it('should render error route if no match was found', () => {
      const markup = renderComponent(
        route.getRouter('/this-route-doesnt-exist-404-error'),
      );

      // Rendered route should be the 404 error
      expect(markup).to.eql(route.errorString);
    });
  });

  describe('Controller', () => {
    it('should be called', () => {
      let wasControllerCalled = false;
      const controller = _ => (wasControllerCalled = true); //eslint-disable-line no-unused-vars

      renderComponent(route.getRouter('/ctrlr', controller));

      expect(wasControllerCalled).to.be.true;
    });

    it('should set props for component', () => {
      const props = { name: 'It Works' };

      const controller = setProps => setProps(props);

      const markup = renderComponent(route.getRouter('/ctrlr', controller));

      expect(markup).to.eql(route.getCtrlrString(props.name));
    });
  });
});
