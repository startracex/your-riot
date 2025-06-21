import type { Expression } from '../types.js'
import normalizeStringValue from '../utils/normalize-string-value.js'

/**
 * This methods handles the input fields value updates.
 */
export default function valueExpression(
  { node }: Expression,
  value: any,
): void {
  // @ts-ignore
  node.value = normalizeStringValue(value)
}
