import formatError from "./format-error.js";
import { unclosedTemplateLiteral } from "../messages.js";
export const $_ES6_BQ = "`";

/**
 * Searches the next backquote that signals the end of the ES6 Template Literal
 * or the "${" sequence that starts a JS expression, skipping any escaped
 * character.
 */
export default function skipES6TL(
  code: string,
  pos: number,
  stack: string[],
): number {
  // we are in the char following the backquote (`),
  // find the next unescaped backquote or the sequence "${"
  const re = /[`$\\]/g;
  let c;
  while (((re.lastIndex = pos), re.exec(code))) {
    pos = re.lastIndex;
    c = code[pos - 1];
    if (c === "`") {
      return pos;
    }
    if (c === "$" && code[pos++] === "{") {
      stack.push($_ES6_BQ, "}");
      return pos;
    }
    // else this is an escaped char
  }
  throw formatError(code, unclosedTemplateLiteral, pos);
}
