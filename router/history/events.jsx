
const handlers= {};

export const routerConfig= {
	type: 'push'
};

/**
 * Trigger update i.e. execute all handlers
 */
export function triggerUpdate() {

	for(let key in handlers) {

		if(!(handlers[key] && handlers[key].handler))
			continue;

		handlers[key].handler();
	}
};


/**
 * Add an update handler
 */
export function addRouteChangeListener(id, callback) {

	if(handlers[id])
		return false;

	handlers[id]= {
		handler: callback
	};

	return true;
}



/**
 * Remove an update handler
 */
export function removeRouteChangeListener(id) {
	
	delete handlers[id];
}