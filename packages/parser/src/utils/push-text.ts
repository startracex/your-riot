import { TEXT } from "../node-types.js";
import type { Expr, ParserState } from "../types.js";
import flush from "./flush-parser-state.js";
import getChunk from "./get-chunk.js";

/**
 * states text in the last text node, or creates a new one if needed.
 * @private
 */
export default function pushText(
  state: ParserState,
  start: number,
  end: number,
  extra: Expr = {},
): number {
  const text = getChunk(state.data, start, end);
  const expressions = extra.expressions;
  const unescape = extra.unescape;

  let q = state.last;
  state.pos = end;

  if (q && q.type === TEXT) {
    q.text += text;
    q.end = end;
  } else {
    flush(state);
    state.last = q = { type: TEXT, text, start, end };
  }

  if (expressions?.length) {
    q.expressions = (q.expressions || []).concat(expressions);
  }

  if (unescape) {
    q.unescape = unescape;
  }

  return TEXT;
}
