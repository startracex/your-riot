import createExpression from "../expression.js";
import type { ExpressionData } from "../types.js";
import flattenCollectionMethods from "../utils/flatten-collection-methods.js";

export default function create(
  node: HTMLElement,
  {
    expressions,
  }: {
    expressions: ExpressionData[];
  },
): Record<"mount" | "update" | "unmount", (scope?: any) => unknown> {
  return flattenCollectionMethods(
    expressions.map((expression) => createExpression(node, expression)),
    ["mount", "update", "unmount"],
  );
}
