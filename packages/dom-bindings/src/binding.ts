import { SIMPLE } from '@your-riot/utils/binding-types'
import { TEXT } from '@your-riot/utils/expression-types'
import bindings from './bindings/index.js'
import { Binding, BindingData } from './types.js'

/**
 * Text expressions in a template tag will get childNodeIndex value normalized
 * depending on the position of the <template> tag offset
 * @param   {Expression[]} expressions - riot expressions array
 * @param   {number} textExpressionsOffset - offset of the <template> tag
 * @returns {Expression[]} expressions containing the text expressions normalized
 */
function fixTextExpressionsOffset(expressions, textExpressionsOffset) {
  return expressions.map((e) =>
    e.type === TEXT
      ? {
          ...e,
          childNodeIndex: e.childNodeIndex + textExpressionsOffset,
        }
      : e,
  )
}

/**
 * Bind a new expression object to a DOM node.
 */
export default function create<Scope = any>(
  root: HTMLElement,
  binding: BindingData<Scope>,
  templateTagOffset?: number | null,
): Binding<Scope> {
  // @ts-ignore
  const { selector, type, redundantAttribute, expressions } = binding
  // find the node to apply the bindings
  const node = selector ? root.querySelector(selector) : root

  // remove eventually additional attributes created only to select this node
  // @ts-ignore
  if (redundantAttribute) node.removeAttribute(redundantAttribute)
  const bindingExpressions = expressions || []

  // init the binding
  return (bindings[type] || bindings[SIMPLE])(node, {
    ...binding,
    expressions:
      templateTagOffset && !selector
        ? fixTextExpressionsOffset(bindingExpressions, templateTagOffset)
        : bindingExpressions,
  })
}
