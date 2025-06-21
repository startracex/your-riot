import type { Expression } from '../types.js'

/**
  This method handles the REF attribute expressions 
 */
export default function refExpression(
  { node, value: oldValue }: Expression,
  value: any,
): void {
  // called on mount and update
  if (value) {
    value(node)
  } // called on unmount
  // in this case the node value is null
  else {
    oldValue(null)
  }
}
