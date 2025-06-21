/**
 * Escape special characters in a given string, in preparation to create a regex.
 */
export default (str: string): string =>
  str.replace(/(?=[-[\](){^*+?.$|\\])/g, "\\");
