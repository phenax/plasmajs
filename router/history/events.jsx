import filter from "lodash/filter";
import forEach from "lodash/forEach";
import isFunction from "lodash/isFunction";

const handlers = new Map();

export const routerConfig = {
  type: "push"
};

/**
 * Trigger update i.e. execute all handlers
 */
export function triggerUpdate() {
  forEach(filter(handlers.values(), handler => isFunction(handler)), handler =>
    handler()
  );
}

/**
 * Add an update handler
 */
export function addRouteChangeListener(id, callback) {
  if (handlers.has(id)) return false;

  handlers.set(id, callback);

  return true;
}

/**
 * Remove an update handler
 */
export function removeRouteChangeListener(id) {
  handlers.delete(id);
}
