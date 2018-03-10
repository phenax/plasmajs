import React from 'react';
import PropTypes from 'prop-types';
import constant from 'lodash/constant';
import noop from 'lodash/noop';

import { Router, Route } from '../router/server.jsx';
import { MockHistoryAPI } from '../router/history/MockHistoryAPI.jsx';
import { action } from '../middlewares/APIResourcesRouter';

// Dummy components
export const Wrapper = ({ children, name }) => (
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

// Mock router component creator
export const getRouter = (url, ctrlr = noop) => () => (
  <Router history={new MockHistoryAPI({}, {}, url)} wrapper={Wrapper}>
    <Route path="/" component={Index} />
    <Route path={/^\/about$/} component={About} />

    <Route path="/ctrlr" component={CtrlrPage} controller={ctrlr} />

    <Route errorHandler={true} component={Error404} />
  </Router>
);

// Expected rendered strings for each routes
export const indexString = '<div><div>Index</div></div>';
export const aboutString = '<div><div>About</div></div>';
export const errorString = '<div><div>Error</div></div>';

// Controller output depends on the name passed in so...
export const getCtrlrString = name => `<div>${name}</div>`;

export const createController = (obj = {}) =>
  class _Controller {
    @action(['get', 'post'], '/')
    index(...props) {
      obj.index && obj.index(...props);
    }

    @action('post', '/add')
    add(...props) {
      obj.add && obj.add(...props);
    }
  };

// Mock context object creator for the http request and response objects
export const mockCtx = (url, requestStuff) => {
  const calledFn = null;
  const calledTarget = null;
  const calledWith = null;
  const ctx = {
    calledFn,
    calledTarget,
    calledWith,

    request: { url, ...requestStuff },

    response: new Proxy(
      {},
      {
        get: (target, field) => {
          ctx.calledTarget = target;

          ctx.calledFn = `response.${field}`;

          return data => {
            ctx.calledWith = data;
            return Promise.resolve();
          };
        },
      },
    ),
  };

  return ctx;
};
