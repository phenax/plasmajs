import React from 'react';
import head from 'lodash/head';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import filter from 'lodash/filter';
import toLower from 'lodash/toLower';
// import {} from 'lodash'; // for searching for functions in VSCode

import { checkUrlMatch } from '../../lib/helper.jsx';
/**
 * Super class for all the history api classes
 */
export default class _HnRouteHistoryAPI {
  // Checks if two routes match
  _isAMatch(url1, currentUrl, isCaseInsensitive = false, method1, method2) {
    // For case insensitive route urls
    if (isString(url1) && isCaseInsensitive) {
      return toLower(url1) === toLower(currentUrl);
    }

    return checkUrlMatch(url1, currentUrl, method1, method2);
  }

  // Iterates through all routes to find the best match
  _findMatchRoute(routes, currentUrl, currentMethod) {
    let errorRoute = null;

    const matchedRoute = head(
      filter(routes, route => {
        const { errorHandler, path, caseInsensitive, method } = route;
        if (!isNil(errorHandler)) {
          errorRoute = route;
          return false;
        }
        if (isNil(path)) {
          return false;
        }
        return this._isAMatch(
          path,
          currentUrl,
          caseInsensitive,
          method,
          currentMethod,
        );
      }),
    );
    if (isNil(matchedRoute)) return errorRoute;
    return matchedRoute;
  }

  _matchRoute(routes, currentUrl) {
    let $renderComponent;

    const route = this._findMatchRoute(routes, currentUrl);

    if (!route) $renderComponent = null;
    else
      $renderComponent = this._getComponentFromClass(
        route.component,
        route.props,
      );

    return {
      url: currentUrl,
      $component: $renderComponent,
      controller: route.controller,
    };
  }

  _getComponentFromClass(Component, props) {
    if (!Component) return null;

    return <Component {...props} />;
  }
}
