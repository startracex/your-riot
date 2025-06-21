import { HASH, SLASH } from "./constants.js";
import { configure } from "rawth";
import { getWindow } from "./util.js";

const normalizeInitialSlash = (str: string): string => {
  return str[0] === SLASH ? str : `${SLASH}${str}`;
};

const removeTrailingSlash = (str: string): string => {
  return str[str.length - 1] === SLASH ? str.substr(0, str.length - 1) : str;
};

const normalizeBase = (base: string): string => {
  const win = getWindow();
  const loc = win.location;
  const root = loc ? `${loc.protocol}//${loc.host}` : "";
  const { pathname } = loc ? loc : {};

  switch (true) {
    // pure root url + pathname
    case Boolean(base) === false:
      return removeTrailingSlash(`${root}${pathname || ""}`);
    // full path base
    case /(www|http(s)?:)/.test(base):
      return base;
    // hash navigation
    case base[0] === HASH:
      return `${root}${pathname && pathname !== SLASH ? pathname : ""}${base}`;
    // root url with trailing slash
    case base === SLASH:
      return removeTrailingSlash(root);
    // custom pathname
    default:
      return removeTrailingSlash(`${root}${normalizeInitialSlash(base)}`);
  }
};

const setBase = (base: string): void => {
  configure({ base: normalizeBase(base) });
};
export { setBase, normalizeBase, normalizeInitialSlash, removeTrailingSlash };
