import type { Expression } from "../types.js";
import normalizeStringValue from "../utils/normalize-string-value.js";

/**
 * Get the the target text node to update or create one from of a comment node.
 */
export const getTextNode = (
  node: HTMLElement,
  childNodeIndex: number,
): Text => {
  return node.childNodes[childNodeIndex] as Text;
};

/**
 * This methods handles a simple text expression update.
 */
export default function textExpression({ node }: Expression, value: any): void {
  // @ts-ignore
  node.data = normalizeStringValue(value);
}
