import { IS_CUSTOM, IS_VOID } from '../constants.js'
import { isCustom, isVoid } from 'dom-nodes'
import { TAG } from '../node-types.js'
import flush from './flush-parser-state.js'
import { ParserState } from '../types.js'

/**
 * Pushes a new *tag* and set `last` to this, so any attributes
 * will be included on this and shifts the `end`.
 * @private
 */
export default function pushTag(
  state: ParserState,
  name: string,
  start: number,
  end: number,
): void {
  const root = state.root
  const last = { type: TAG, name, start, end }

  if (isCustom(name)) {
    last[IS_CUSTOM] = true
  }

  if (isVoid(name)) {
    last[IS_VOID] = true
  }

  state.pos = end

  if (root) {
    if (name === root.name) {
      state.count++
    } else if (name === root.close) {
      state.count--
    }
    flush(state)
  } else {
    // start with root (keep ref to output)
    state.root = { name: last.name, close: `/${name}` }
    state.count = 1
  }

  state.last = last
}
