import { COMMENT, TEXT } from '../node-types.js'
import flush from '../utils/flush-parser-state.js'
import panic from '../utils/panic.js'
import { unclosedComment } from '../messages.js'
import type { ParserState } from '../types.js'

/**
 * Parses comments in long or short form
 * (any DOCTYPE & CDATA blocks are parsed as comments).
 */
export default function comment(
  state: ParserState,
  data: string,
  start: number,
): number {
  const pos = start + 2 // skip '<!'
  const isLongComment = data.substr(pos, 2) === '--'
  const str = isLongComment ? '-->' : '>'
  const end = data.indexOf(str, pos)

  if (end < 0) {
    panic(data, unclosedComment, start)
  }

  pushComment(
    state,
    start,
    end + str.length,
    data.substring(start, end + str.length),
  )

  return TEXT
}

/**
 * Parse a comment.
 * @private
 */
export function pushComment(
  state: ParserState,
  start: number,
  end: number,
  text: string,
): void {
  state.pos = end
  if (state.options.comments === true) {
    flush(state)
    state.last = {
      type: COMMENT,
      start,
      end,
      text,
    }
  }
}
