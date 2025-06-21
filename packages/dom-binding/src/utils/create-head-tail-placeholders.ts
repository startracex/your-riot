import { HEAD_SYMBOL, TAIL_SYMBOL } from '../constants.js'

/**
 * Create the <template> fragments text nodes
 */
export default function createHeadTailPlaceholders(): {
  head: Text
  tail: Text
} {
  const head = document.createTextNode('')
  const tail = document.createTextNode('')

  head[HEAD_SYMBOL] = true
  tail[TAIL_SYMBOL] = true

  return { head, tail }
}
