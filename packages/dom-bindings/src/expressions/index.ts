import {
  ATTRIBUTE,
  EVENT,
  TEXT,
  VALUE,
  REF,
} from '@your-riot/utils/expression-types'
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
  [ATTRIBUTE]: attributeExpression,
  [EVENT]: eventExpression,
  [TEXT]: textExpression,
  [VALUE]: valueExpression,
  [REF]: refExpression,
}
export default _default_1
