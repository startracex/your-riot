import createExpression from '../expression.ts'
import type { ExpressionData } from '../types.ts'
import flattenCollectionMethods from '../utils/flatten-collection-methods.ts'

export default function create(
  node: HTMLElement,
  {
    expressions,
  }: {
    expressions: ExpressionData[]
  },
): Record<'mount' | 'update' | 'unmount', (scope?: any) => unknown> {
  return flattenCollectionMethods(
    expressions.map((expression) => createExpression(node, expression)),
    ['mount', 'update', 'unmount'],
  )
}
