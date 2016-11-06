
import _HnRouteHistoryAPI from './_HnRouteHistoryAPI.jsx';

import {routerConfig} from './events.jsx';


/**
 * Helper class to be passed into the HnRouter component for 
 * routing in NodeJS
 */
export class NodeHistoryAPI extends _HnRouteHistoryAPI {

	constructor(req, res) {
		super();

		this._req= req;
		this.response= res;

		this._defaultErrorHandler= {
			errorHandler: true,
			component: createElement('div', {}, '404 Not Found');
		};

		routerConfig.type= 'node';
	}


	// Finds the best match for the current request from the routes
	matchRoute(routes) {

		this._currentUrl= this._req.url;

		// Find the best match
		const route= this._findMatchRoute(routes, this._currentUrl, this._req.method) || this._defaultErrorHandler;

		// Set the response status code
		this.response.statusCode= (route.errorHandler)? 404: (route.statusCode || 200);

		return {

			url: this._currentUrl,
			
			$component: this._getComponentFromClass(
				route.component, 
				route.props
			),

			controller: route.controller
		};
	}
}
