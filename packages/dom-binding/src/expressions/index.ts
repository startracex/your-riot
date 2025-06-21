import expressionTypes from '@your-riot/utils/expression-types'
import attributeExpression from './attribute.js'
import eventExpression from './event.js'
import textExpression from './text.js'
import valueExpression from './value.js'
import refExpression from './ref.js'

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
