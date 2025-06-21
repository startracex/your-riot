import bindingTypes from "@your-riot/utils/binding-types";
import expressionTypes from "@your-riot/utils/expression-types";
import bindings from "./binding/index.js";
import type { Binding, BindingData, Expression } from "./types.js";

/**
 * Text expressions in a template tag will get childNodeIndex value normalized
 * depending on the position of the <template> tag offset.
 */
function fixTextExpressionsOffset(
  expressions: Expression[],
  textExpressionsOffset: number,
): Expression[] {
  return expressions.map((e) =>
    e.type === expressionTypes.TEXT
      ? {
          ...e,
          // @ts-ignore
          childNodeIndex: e.childNodeIndex + textExpressionsOffset,
        }
      : e,
  );
}

/**
 * Bind a new expression object to a DOM node.
 */
export function createBinding<Scope = any>(
  root: HTMLElement,
  binding: BindingData<Scope>,
  templateTagOffset?: number | null,
): Binding<Scope> {
  // @ts-ignore
  const { selector, type, redundantAttribute, expressions } = binding;
  // find the node to apply the bindings
  const node = selector ? root.querySelector(selector) : root;

  // remove eventually additional attributes created only to select this node
  // @ts-ignore
  if (redundantAttribute) {
    node.removeAttribute(redundantAttribute);
  }
  const bindingExpressions = expressions || [];

  // init the binding
  return (bindings[type] || bindings[bindingTypes.SIMPLE])(node, {
    ...binding,
    expressions:
      templateTagOffset && !selector
        ? fixTextExpressionsOffset(bindingExpressions, templateTagOffset)
        : bindingExpressions,
  });
}
export default createBinding;
