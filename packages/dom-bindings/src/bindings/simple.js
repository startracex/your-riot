import createExpression from '../expression.js'
import flattenCollectionMethods from '../utils/flatten-collection-methods.js'

export default function create(node, { expressions }) {
  return flattenCollectionMethods(
    expressions.map((expression) => createExpression(node, expression)),
    ['mount', 'update', 'unmount'],
  )
}
