import React from 'react';
import PropTypes from 'prop-types';

import assign from 'lodash/assign';
import concat from 'lodash/concat';
import constant from 'lodash/constant';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import map from 'lodash/map';
import toLower from 'lodash/toLower';

import { MiddleWare } from '../MiddleWare';

import { checkUrlMatch } from '../lib/helper';

/**
 * Api resources structure
 *
 *
 */
export class Resource extends MiddleWare {
  toUrl(path) {
    return `/${this.props.name}${path}`;
  }

  onRequest() {
    this._controller = {};
    this._actions = [];

    const Ctrlr = this.props.controller;

    this._actions = map(this.props.children || [], child => {
      const { props: { path, method, handler } } = child;
      const action = {
        url: this.toUrl(path),
        methods: [toLower(method)],
        handler,
      };

      if (isString(action.handler)) {
        return { ...action, handler: Ctrlr[action.handler] };
      }

      return action;
    });

    if (isFunction(Ctrlr)) {
      this._controller = new Ctrlr();

      this._actions = concat(
        this._actions,
        map(
          filter(
            filter(
              map(
                Object.getOwnPropertyNames(Ctrlr.prototype),
                key => this._controller[key],
              ),
              action => isFunction(action),
            ),
            'isAction',
          ),
          action => {
            return {
              url: this.toUrl(action.actionName),
              methods: action.actionMethods,
              handler: action,
            };
          },
        ),
      );
    }

    this._executeMatchingAction();
  }

  _executeMatchingAction() {
    for (let i = 0; i < this._actions.length; i++) {
      const action = this._actions[i];

      for (let j = 0; j < action.methods.length; j++) {
        const isAMatch = checkUrlMatch(
          action.url,
          this.props.request.url,
          this.props.request.method,
          action.methods[j],
        );

        if (isAMatch) {
          this.terminate();

          this.props.response.statusCode = 200;

          const promise = action.handler(
            this.props.request,
            this.props.response,
          );

          if (promise instanceof Promise) {
            promise.then(this.emitResponse).catch(this.emitError);
          }
          return;
        }
      }
    }
  }

  emitResponse(data = {}) {
    this.props.response.json(data);
  }

  emitError(e = {}) {
    this.props.response.statusCode = e.statusCode || 500;
    this.props.response.json(e);
  }
}

export class Action extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.string,
    handler: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.function,
      PropTypes.object,
    ]).isRequired,
    // handler: React.PropTypes.object, string or function
  };

  render = constant(null);
}

/**
 *
 */
export const action = (method = null, path = null) => (_, __, fnMeta) => {
  assign(fnMeta.value, {
    isAction: true,
    actionName: path !== null ? path : '/' + fnMeta.value.name,
    actionMethods: map(isArray(method) ? method : [method || 'get'], m =>
      toLower(m),
    ),
  });
};
