
import _HnRouteHistoryAPI from './_HnRouteHistoryAPI.jsx';

import * as events from './events.jsx';


/**
 * Helper class to be passed into the HnRouter component for 
 * routing on the client side (hash routing)
 */
export class HashHistoryAPI extends _HnRouteHistoryAPI {

	constructor(config) {
		super();

		this._config= config;

		events.routerConfig.type= 'hash';
	}

	_parseHash(hash) {
		return hash.replace('#', '');
	}

	matchRoute(routes) {

		if(window.location.hash == '')
			window.location.hash= '#/';

		this._currentUrl= this._parseHash(window.location.hash);

		if(this._currentUrl == '')
			this._currentUrl= '/';

		return this._matchRoute(routes, this._currentUrl);
	}

	routeChangeListener() {

		window.addEventListener('hashchange', events.triggerUpdate);
	}

	removeChangeListener() {

		window.removeEventListener('hashchange', events.triggerUpdate);
	}
}

