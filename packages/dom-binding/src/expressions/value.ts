import { Expression } from '../types.ts'
import normalizeStringValue from '../utils/normalize-string-value.ts'

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
