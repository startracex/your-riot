import { COMPONENTS_IMPLEMENTATION_MAP, panic } from '@your-riot/util'
import cssManager from '../core/css-manager.js'

/**
 * Unregister a riot web component
 * @param   {string} name - component name
 * @returns {Map} map containing all the components implementations
 */
export function unregister(name) {
  if (!COMPONENTS_IMPLEMENTATION_MAP.has(name))
    panic(`The component "${name}" was never registered`)

  COMPONENTS_IMPLEMENTATION_MAP.delete(name)
  cssManager.remove(name)

  return COMPONENTS_IMPLEMENTATION_MAP
}
