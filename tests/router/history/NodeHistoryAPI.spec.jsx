// @flow
import React from 'react';
import PropTypes from 'prop-types';

import constant from 'lodash/constant';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import noop from 'lodash/noop';

import { expect } from 'chai';

// import nock from 'nock';

import { Router, Route } from '../../../router/server';
import { NodeHistoryAPI } from '../../../router/history/NodeHistoryAPI';

const Wrapper = ({ children, name }) => (
  <div>
    {children}
    {name}
  </div>
);
Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export const Index = () => <div>Index</div>;
export const About = () => <div>About</div>;
export const Error404 = () => <div>Error</div>;

export const CtrlrPage = () => constant(null);

const router = (
  <Router history={new NodeHistoryAPI(null, null)}>
    <Route path="/" component={Index} />
    <Route path={/^\/about$/} component={About} />

    <Route path="/ctrlr" component={CtrlrPage} controller={noop} />

    <Route errorHandler={true} component={Error404} />
  </Router>
);
describe('Router', () => {
  describe('Node History API', () => {
    it('can be created', () => {
      const history = new NodeHistoryAPI(null, null);
      expect(history).to.be.an.instanceof(NodeHistoryAPI);
    });
  });
  describe('Configuration', () => {
    describe('Node History API', () => {
      it('should have the history api', () => {
        expect(router.props.history).to.exist;
        expect(router.props.history).to.be.instanceof(NodeHistoryAPI);
      });

      it('should have all routes', () => {
        expect(router.props.children).to.not.be.empty;

        forEach(router.props.children, child => {
          expect(child).to.exist;

          expect(child.type).to.eql(<Route component={noop} />.type);
        });
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
  });
});
