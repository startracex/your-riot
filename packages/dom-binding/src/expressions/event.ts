import type { Expression } from "../types.js";

const RE_EVENTS_PREFIX = /^on/;

const getCallbackAndOptions = (value) =>
  Array.isArray(value) ? value : [value, false];

// see also https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
const _eventListener = {
  handleEvent(event) {
    this[event.type](event);
  },
};
const _listenersWeakMap = new WeakMap();

const createListener = (node) => {
  const listener = Object.create(_eventListener);
  _listenersWeakMap.set(node, listener);
  return listener;
};

/**
 * Set a new event listener.
 */
export default function eventExpression(
  { node, name }: Expression,
  value: any,
): void {
  const normalizedEventName = name.replace(RE_EVENTS_PREFIX, "");
  const eventListener = _listenersWeakMap.get(node) || createListener(node);
  const [callback, options] = getCallbackAndOptions(value);
  const handler = eventListener[normalizedEventName];
  const mustRemoveEvent = handler && !callback;
  const mustAddEvent = callback && !handler;

  if (mustRemoveEvent) {
    node.removeEventListener(normalizedEventName, eventListener);
  }

  if (mustAddEvent) {
    node.addEventListener(normalizedEventName, eventListener, options);
  }

  eventListener[normalizedEventName] = callback;
}
