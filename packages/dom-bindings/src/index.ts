/**
 * Method used to bind expressions to a DOM node.
 * @example
 *
 * riotDOMBindings
 *  .template(
 *   `<div expr0> </div><div><p expr1> <section expr2></section></p>`,
 *   [
 *     {
 *       selector: '[expr0]',
 *       redundantAttribute: 'expr0',
 *       expressions: [
 *         {
 *           type: expressionTypes.TEXT,
 *           childNodeIndex: 0,
 *           evaluate(scope) {
 *             return scope.time;
 *           },
 *         },
 *       ],
 *     },
 *     {
 *       selector: '[expr1]',
 *       redundantAttribute: 'expr1',
 *       expressions: [
 *         {
 *           type: expressionTypes.TEXT,
 *           childNodeIndex: 0,
 *           evaluate(scope) {
 *             return scope.name;
 *           },
 *         },
 *         {
 *           type: 'attribute',
 *           name: 'style',
 *           evaluate(scope) {
 *             return scope.style;
 *           },
 *         },
 *       ],
 *     },
 *     {
 *       selector: '[expr2]',
 *       redundantAttribute: 'expr2',
 *       type: bindingTypes.IF,
 *       evaluate(scope) {
 *         return scope.isVisible;
 *       },
 *       template: riotDOMBindings.template('hello there'),
 *     },
 *   ]
 * )
 */
export { default as template } from './template.js'

/**
 * Bind a new expression object to a single DOM node.
 */
export { default as createBinding } from './binding.js'

/**
 * Create a single template expression.
 */
export { default as createExpression } from './expression.js'

/**
 * Object containing all the binding types.
 */
export { default as bindingTypes } from '@your-riot/utils/binding-types'

/**
 * Object containing all the expression types.
 */
export { default as expressionTypes } from '@your-riot/utils/expression-types'

export type * from './types.js'
export type { TemplateChunk } from './template.js'
