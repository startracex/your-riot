/*
 * Mini-parser for expressions.
 * The main pourpose of this module is to find the end of an expression
 * and return its text without the enclosing brackets.
 * Does not works with comments, but supports ES6 template strings.
 */
import skipES6TL, { $_ES6_BQ } from "./skip-es6-tl.js";
import { unclosedExpression, unexpectedCharInExpression } from "../messages.js";
import escapeStr from "./escape-str.js";
import panic from "./panic.js";
import skipRegex from "./skip-regex.js";

/**
 * @exports exprExtr
 */
const S_SQ_STR = /'[^'\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^'\n\r\\]*)*'/.source;

/**
 * Matches double quoted JS strings taking care about nested quotes
 * and EOLs (escaped EOLs are Ok).
 * @private
 */
const S_STRING = `${S_SQ_STR}|${S_SQ_STR.replace(/'/g, '"')}`;

/**
 * Regex cache
 *
 * @type {Object.<string, RegExp>}
 * @const
 * @private
 */
const reBr: { [s: string]: RegExp } = {};

/**
 * Makes an optimal regex that matches quoted strings, brackets, backquotes
 * and the closing brackets of an expression.
 */
function _regex(b: string): RegExp {
  let re = reBr[b];
  if (!re) {
    let s = escapeStr(b);
    if (b.length > 1) {
      s = `${s}|[`;
    } else {
      s = /[{}[\]()]/.test(b) ? "[" : `[${s}`;
    }
    reBr[b] = re = new RegExp(`${S_STRING}|${s}\`/\\{}[\\]()]`, "g");
  }
  return re;
}

/**
 * Update the scopes stack removing or adding closures to it.
 */
function updateStack(
  stack: any[],
  char: string,
  idx: number,
  code: string,
): {
  char: string;
  index: number;
} {
  let index = 0;

  switch (char) {
    case "[":
    case "(":
    case "{":
      stack.push(char === "[" ? "]" : char === "(" ? ")" : "}");
      break;
    case ")":
    case "]":
    case "}":
      if (char !== stack.pop()) {
        panic(code, unexpectedCharInExpression.replace("%1", char), index);
      }

      if (char === "}" && stack[stack.length - 1] === $_ES6_BQ) {
        char = stack.pop();
      }

      index = idx + 1;
      break;
    case "/":
      index = skipRegex(code, idx);
  }

  return { char, index };
}

/**
 * Parses the code string searching the end of the expression.
 * It skips braces, quoted strings, regexes, and ES6 template literals.
 */
export default function exprExtr(
  code: string,
  start: number,
  bp: [string, string],
): {
  end: number;
  text: string;
  start: number;
} {
  const [openingBraces, closingBraces] = bp;
  const offset = start + openingBraces.length; // skips the opening brace
  const stack = []; // expected closing braces ('`' for ES6 TL)
  const re = _regex(closingBraces);

  re.lastIndex = offset; // begining of the expression

  let end;
  let match;

  while ((match = re.exec(code))) {
    // eslint-disable-line
    const idx = match.index;
    const str = match[0];
    end = re.lastIndex;

    // end the iteration
    if (str === closingBraces && !stack.length) {
      return {
        text: code.slice(offset, idx),
        start,
        end,
      };
    }

    const { char, index } = updateStack(stack, str[0], idx, code);
    // update the end value depending on the new index received
    end = index || end;
    // update the regex last index
    re.lastIndex = char === $_ES6_BQ ? skipES6TL(code, end, stack) : end;
  }

  if (stack.length) {
    panic(code, unclosedExpression, end);
  }
}
