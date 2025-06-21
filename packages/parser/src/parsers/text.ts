import { TAG, TEXT } from '../node-types.js'
import { RE_SCRYLE } from '../regex.js'
import { TEXTAREA_TAG } from '../constants.js'
import execFromPos from '../utils/exec-from-pos.js'
import expr from './expression.js'
import panic from '../utils/panic.js'
import pushTag from '../utils/push-tag.js'
import pushText from '../utils/push-text.js'
import { unclosedNamedBlock } from '../messages.js'
import type { ParserState } from '../types.js'

/**
 * Parses regular text and script/style blocks ...scryle for short :-)
 * (the content of script and style is text as well).
 * @private
 */
export default function text(state: ParserState): number {
  const { pos, data, scryle } = state

  switch (true) {
    case typeof scryle === 'string': {
      const name = scryle
      const re = RE_SCRYLE[name]
      const match = execFromPos(re, pos, data)

      if (!match) {
        panic(data, unclosedNamedBlock.replace('%1', name), pos - 1)
      }

      const start = match.index
      const end = re.lastIndex
      state.scryle = null // reset the script/style flag now
      // write the tag content
      if (start > pos) {
        parseSpecialTagsContent(state, name, match)
      } else if (name !== TEXTAREA_TAG) {
        state.last.text = {
          type: TEXT,
          text: '',
          start: pos,
          end: pos,
        }
      }
      // now the closing tag, either </script> or </style>
      pushTag(state, `/${name}`, start, end)
      break
    }
    case data[pos] === '<':
      state.pos++
      return TAG
    default:
      expr(state, null, '<', pos)
  }

  return TEXT
}

/**
 * Parse the text content depending on the name.
 */
function parseSpecialTagsContent(
  state: ParserState,
  name: string,
  match: RegExpMatchArray,
) {
  const { pos } = state
  const start = match.index

  if (name === TEXTAREA_TAG) {
    expr(state, null, match[0], pos)
  } else {
    pushText(state, pos, start)
  }
}
