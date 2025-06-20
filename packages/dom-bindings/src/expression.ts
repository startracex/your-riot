import expressionTypes from '@your-riot/utils/expression-types'
import expressions from './expressions/index.js'
import { getTextNode } from './expressions/text.js'
import { ExpressionData, Expression as ExpressionType } from './types.js'

export const Expression = {
  // Static props
  // node: null,
  // value: null,

  // API methods
  /**
   * Mount the expression evaluating its initial value
   * @param   {*} scope - argument passed to the expression to evaluate its current values
   * @returns {Expression} self
   */
  mount(scope) {
    // hopefully a pure function
    this.value = this.evaluate(scope)

    // IO() DOM updates
    expressions[this.type](this, this.value)

    return this
  },
  /**
   * Update the expression if its value changed
   * @param   {*} scope - argument passed to the expression to evaluate its current values
   * @returns {Expression} self
   */
  update(scope) {
    // pure function
    const value = this.evaluate(scope)

    if (this.value !== value) {
      // IO() DOM updates
      expressions[this.type](this, value)
      this.value = value
    }

    return this
  },
  /**
   * Expression teardown method
   * @returns {Expression} self
   */
  unmount() {
    // unmount event and ref expressions
    if ([expressionTypes.EVENT, expressionTypes.REF].includes(this.type)) expressions[this.type](this, null)

    return this
  },
} as any as ExpressionType

export default function create<Scope = any>(
  node: HTMLElement,
  data: ExpressionData<Scope>,
): ExpressionType<Scope> {
  return {
    ...Expression,
    ...data,
    // @ts-ignore
    node: data.type === expressionTypes.TEXT ? getTextNode(node, data.childNodeIndex) : node,
  }
}
