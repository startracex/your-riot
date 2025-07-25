import { DOMattributesToObject, callOrAssign } from "@your-riot/utils";

/**
 * Evaluate the component properties either from its real attributes or from its initial user properties
 * @param   {HTMLElement} element - component root
 * @param   {Object}  initialProps - initial props
 * @returns {Object} component props key value pairs
 */
export function computeInitialProps(element, initialProps = {}) {
  return {
    ...DOMattributesToObject(element),
    ...callOrAssign(initialProps),
  };
}
