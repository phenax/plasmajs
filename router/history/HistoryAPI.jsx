
import _HnRouteHistoryAPI from './_HnRouteHistoryAPI';

import * as events from './events';


/**
 * Helper class to be passed into the HnRouter component for 
 * routing on the client side (pushState routing)
 */
export class HistoryAPI extends _HnRouteHistoryAPI {

	constructor(config) {
		super();

		this._randomId= Math.floor(Math.random()*1000000).toString(16);

		window.addEventListener('popstate', events.triggerUpdate);

		events.routerConfig.type= 'push';
	}

	get location() {
		return {
			push(url='/', state={}, title='') {
				window.history.pushState(state, title, url);
				events.triggerUpdate();
			},
			replace(url='/', state={}, title='') {
				window.history.replaceState(state, title, url);
				events.triggerUpdate();
			}
		}
	}

	matchRoute(routes) {

		this._currentUrl= window.location.pathname;

		return this._matchRoute(routes, this._currentUrl);
	}

	routeChangeListener(callback) {

		events.addRouteChangeListener(this._randomId, 
			event => {
				callback({
					url: window.location.pathname
				});
			}
		);
	}

	removeChangeListener() {
		events.removeRouteChangeListener(this._randomId);
		window.removeEventListener('popstate', events.triggerUpdate);
	}
}
