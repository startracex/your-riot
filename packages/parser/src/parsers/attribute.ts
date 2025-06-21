import { ATTR, TEXT } from '../node-types.js'
import { ATTR_START, SPREAD_OPERATOR } from '../regex.js'
import { IS_BOOLEAN, IS_SELF_CLOSING, IS_SPREAD } from '../constants.js'
import addToCollection from '../utils/add-to-collection.js'
import execFromPos from '../utils/exec-from-pos.js'
import expr from './expression.js'
import getChunk from '../utils/get-chunk.js'
import { isBoolAttribute } from 'dom-nodes/index.next.js'
import memoize from '../utils/memoize.js'
import type { Attribute, ParserState } from '../types.js'

const expressionsContentRe = memoize((brackets: any[]) =>
  RegExp(`(${brackets[0]}[^${brackets[1]}]*?${brackets[1]})`, 'g'),
)
const isSpreadAttribute = (name: string): boolean => SPREAD_OPERATOR.test(name)

const isAttributeExpression = (
  name: string,
  brackets: [string, string],
): boolean => name[0] === brackets[0]

const getAttributeEnd = (state: ParserState, attr: Attribute): number =>
  expr(state, attr, '[>/\\s]', attr.start)

/**
 * The more complex parsing is for attributes as it can contain quoted or
 * unquoted values or expressions.
 * @private
 */
export default function attr(state: ParserState): number {
  const { data, last, pos, root } = state
  const tag = last // the last (current) tag in the output
  const _CH = /\S/g // matches the first non-space char
  const ch = execFromPos(_CH, pos, data)

  switch (true) {
    case !ch:
      state.pos = data.length // reaching the end of the buffer with
      // NodeTypes.ATTR will generate error
      break
    case ch[0] === '>':
      // closing char found. If this is a self-closing tag with the name of the
      // Root tag, we need decrement the counter as we are changing mode.
      state.pos = tag.end = _CH.lastIndex
      if (tag[IS_SELF_CLOSING]) {
        state.scryle = null // allow selfClosing script/style tags
        if (root && root.name === tag.name) {
          state.count-- // "pop" root tag
        }
      }
      return TEXT
    case ch[0] === '/':
      state.pos = _CH.lastIndex // maybe. delegate the validation
      tag[IS_SELF_CLOSING] = true // the next loop
      break
    default:
      delete tag[IS_SELF_CLOSING] // ensure unmark as selfclosing tag
      setAttribute(state, ch.index, tag)
  }

  return ATTR
}

/**
 * Parses an attribute and its expressions.
 * @private
 */
function setAttribute(
  state: ParserState,
  pos: number,
  tag: {
    end?: number
    attributes?: any[]
  },
): void {
  const { data } = state
  const expressionContent = expressionsContentRe(state.options.brackets)
  const re = ATTR_START // (\S[^>/=\s]*)(?:\s*=\s*([^>/])?)? g
  const start = (re.lastIndex = expressionContent.lastIndex = pos) // first non-whitespace
  const attrMatches = re.exec(data)
  const isExpressionName = isAttributeExpression(
    attrMatches[1],
    state.options.brackets,
  )
  const match: RegExpMatchArray = isExpressionName
    ? [null, expressionContent.exec(data)[1], null]
    : attrMatches

  if (match) {
    const end = re.lastIndex
    const attr = parseAttribute(state, match, start, end, isExpressionName)

    //assert(q && q.type === Mode.TAG, 'no previous tag for the attr!')
    // Pushes the attribute and shifts the `end` position of the tag (`last`).
    state.pos = tag.end = attr.end
    tag.attributes = addToCollection(tag.attributes, attr)
  }
}

function parseNomalAttribute(
  state: ParserState,
  attr: Attribute,
  quote: string,
): Attribute {
  const { data } = state
  let { end } = attr

  if (isBoolAttribute(attr.name)) {
    attr[IS_BOOLEAN] = true
  }

  // parse the whole value (if any) and get any expressions on it
  if (quote) {
    // Usually, the value's first char (`quote`) is a quote and the lastIndex
    // (`end`) is the start of the value.
    let valueStart = end
    // If it not, this is an unquoted value and we need adjust the start.
    if (quote !== '"' && quote !== "'") {
      quote = '' // first char of value is not a quote
      valueStart-- // adjust the starting position
    }

    end = expr(state, attr, quote || '[>/\\s]', valueStart)

    // adjust the bounds of the value and save its content
    return Object.assign(attr, {
      value: getChunk(data, valueStart, end),
      valueStart,
      end: quote ? ++end : end,
    })
  }

  return attr
}

/**
 * Parse expression names <a {href}>.
 */
function parseSpreadAttribute(state: ParserState, attr: Attribute): Attribute {
  const end = getAttributeEnd(state, attr)

  return {
    [IS_SPREAD]: true,
    start: attr.start,
    expressions: attr.expressions.map((expr: { text: string }) =>
      Object.assign(expr, {
        text: expr.text.replace(SPREAD_OPERATOR, '').trim(),
      }),
    ),
    end: end,
  }
}

/**
 * Parse expression names <a {href}>
 */
function parseExpressionNameAttribute(
  state: ParserState,
  attr: Attribute,
): Attribute {
  const end = getAttributeEnd(state, attr)

  return {
    start: attr.start,
    name: attr.expressions[0].text.trim(),
    expressions: attr.expressions,
    end: end,
  }
}

/**
 * Parse the attribute values normalising the quotes.
 */
function parseAttribute(
  state: ParserState,
  match: RegExpMatchArray,
  start: number,
  end: number,
  isExpressionName: boolean,
): Attribute {
  const attr = {
    name: match[1],
    value: '',
    start,
    end,
  }

  const quote = match[2] // first letter of value or nothing

  switch (true) {
    case isSpreadAttribute(attr.name):
      return parseSpreadAttribute(state, attr)
    case isExpressionName === true:
      return parseExpressionNameAttribute(state, attr)
    default:
      return parseNomalAttribute(state, attr, quote)
  }
}
