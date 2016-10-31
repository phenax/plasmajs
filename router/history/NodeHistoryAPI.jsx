
import _HnRouteHistoryAPI from './_HnRouteHistoryAPI';

import {routerConfig} from './events';


/**
 * Helper class to be passed into the HnRouter component for 
 * routing in NodeJS
 */
export class NodeHistoryAPI extends _HnRouteHistoryAPI {

	constructor(req, res) {
		super();

		this._req= req;
		this.response= res;

		routerConfig.type= 'node';
	}

	matchRoute(routes) {

		this._currentUrl= this._req.url;

		const route= this._findMatchRoute(routes, this._currentUrl);

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
