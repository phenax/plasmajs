
import React from 'react';

import { checkUrlMatch } from '../../lib/helper.jsx';

/**
 * Super class for all the history api classes
 */
export default class _HnRouteHistoryAPI {

	// Checks if two routes match
	_isAMatch(url1, currentUrl, isCaseInsensitive=false, method1, method2) {

		// For case insensitive route urls
		if(typeof(url1) === "string" && isCaseInsensitive) {
			return (url1.toLowerCase() === currentUrl.toLowerCase());
		}

		return checkUrlMatch(url1, currentUrl, method1, method2);
	}

	// Iterates through all routes to find the best match
	_findMatchRoute(routes, currentUrl, currentMethod) {

		let errorRoute= null;

		for(let i= 0; i< routes.length; i++) {

			// If its an error handler
			if(routes[i].errorHandler) {
				errorRoute= routes[i];
				continue;
			}

			// If the path prop is not set
			if(!('path' in routes[i]))
				continue;

			// Check if route matches and return it
			if(
				this._isAMatch(
					routes[i].path, 
					currentUrl, 
					routes[i].caseInsensitive, 
					routes[i].method, 
					currentMethod
				)
			) return routes[i];
		}

		return errorRoute;
	}


	_matchRoute(routes, currentUrl) {

		let $renderComponent;

		const route= this._findMatchRoute(routes, currentUrl);

		if(!route)
			$renderComponent= null;
		else
			$renderComponent= this._getComponentFromClass(
				route.component, 
				route.props
			);

		return {
			url: currentUrl,
			$component: $renderComponent,
			controller: route.controller
		};
	}


	_getComponentFromClass(Component, props) {

		if(!Component)
			return null;

		return <Component {...props} />;
	}
}