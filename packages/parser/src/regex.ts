/**
 * Matches the start of valid tags names; used with the first 2 chars after the `'<'`.
 * @const
 * @private
 */
export const TAG_2C: RegExp = /^(?:\/[a-zA-Z]|[a-zA-Z][^\s>/]?)/;
/**
 * Matches valid tags names AFTER the validation with `TAG_2C`.
 * $1: tag name including any `'/'`, $2: non self-closing brace (`>`) w/o attributes.
 * @private
 */
export const TAG_NAME: RegExp = /(\/?[^\s>/]+)\s*(>)?/g;
/**
 * Matches an attribute name-value pair (both can be empty).
 * $1: attribute name, $2: value including any quotes.
 * @private
 */
export const ATTR_START: RegExp = /(\S[^>/=\s]*)(?:\s*=\s*([^>/])?)?/g;

/**
 * Matches the spread operator
 * it will be used for the spread attributes
 */
export const SPREAD_OPERATOR: RegExp = /\.\.\./;
/**
 * Matches the closing tag of a `script` and `style` block.
 * Used by parseText fo find the end of the block.
 * @private
 */
export const RE_SCRYLE: {
  script: RegExp;
  style: RegExp;
  textarea: RegExp;
} = {
  script: /<\/script\s*>/gi,
  style: /<\/style\s*>/gi,
  textarea: /<\/textarea\s*>/gi,
};

// Do not touch text content inside this tags
export const RAW_TAGS: RegExp = /^\/?(?:pre|textarea)$/;
