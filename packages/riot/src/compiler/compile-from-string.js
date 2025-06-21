import * as compiler from "@your-riot/compiler/essential";

export function compileFromString(string, options) {
  return compiler.compile(string, options);
}
