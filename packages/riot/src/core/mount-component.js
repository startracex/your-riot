import { COMPONENTS_IMPLEMENTATION_MAP, panic } from "@your-riot/utils";
import { getName } from "../utils/dom.js";

/**
 * Component initialization function starting from a DOM node
 * @param   {HTMLElement} element - element to upgrade
 * @param   {Object} initialProps - initial component properties
 * @param   {string} componentName - component id
 * @param   {Array} slots - component slots
 * @returns {Object} a new component instance bound to a DOM node
 */
export function mountComponent(element, initialProps, componentName, slots) {
  const name = componentName || getName(element);
  if (!COMPONENTS_IMPLEMENTATION_MAP.has(name)) {
    panic(`The component named "${name}" was never registered`);
  }

  const component = COMPONENTS_IMPLEMENTATION_MAP.get(name)({
    props: initialProps,
    slots,
  });

  return component.mount(element);
}
