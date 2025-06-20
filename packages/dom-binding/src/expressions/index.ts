import expressionTypes from '@your-riot/utils/expression-types'
import attributeExpression from './attribute.ts'
import eventExpression from './event.ts'
import textExpression from './text.ts'
import valueExpression from './value.ts'
import refExpression from './ref.ts'

const _default_1: {
  0: any
  1: typeof eventExpression
  2: typeof textExpression
  3: typeof valueExpression
  4: typeof refExpression
} = {
  [expressionTypes.ATTRIBUTE]: attributeExpression,
  [expressionTypes.EVENT]: eventExpression,
  [expressionTypes.TEXT]: textExpression,
  [expressionTypes.VALUE]: valueExpression,
  [expressionTypes.REF]: refExpression,
}
export default _default_1
