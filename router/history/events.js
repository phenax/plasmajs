// @flow
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import map from 'lodash/map';
import isFunction from 'lodash/isFunction';

const handlers: Map<string, Function> = new Map();

export const routerConfig = {
  type: 'push',
};

/**
 * Trigger update i.e. execute all handlers
 */
export function triggerUpdate() {
  return map(filter(Array.from(handlers.values()), isFunction), handler =>
    handler(),
  );
}

/**
 * Add an update handler
 * @param {String} id the ID to trigger with
 * @param {Function} callback the function to run at the specified ID
 * @returns {Boolean} true when the listener was added successfully
 */
export function addRouteChangeListener(id: string, callback: Function) {
  if (handlers.has(id)) return false;

  handlers.set(id, callback);

  return true;
}

/**
 * Remove an update handler
 * @param {String} id the ID to delete
 */
export function removeRouteChangeListener(id: string) {
  handlers.delete(id);
}

/**
 * Exposes the handlers (i.e., for testing)
 * @returns {Map<string, Function>} the handlers as a map object
 */
export function exposeRouteChangeListeners() {
  return clone(handlers);
}
