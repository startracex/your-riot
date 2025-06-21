import { compile, type CompilerOptions } from "@your-riot/compiler";
import { getFilter } from "./helper.js";
import type { ParserOutput } from "@your-riot/parser";
import type { FilterPattern } from "@rollup/pluginutils";
import { transform, type TransformOptions } from "oxc-transform";

const scriptRegex = /<script(\s+lang="ts")?>((.|\n)*?)<\/script>/i;
function transformScriptContent(
  content: string,
  options?: TransformOptions,
): string {
  const match = content.match(scriptRegex);

  if (match) {
    const scriptContent = match[2];
    const { code } = transform("_.ts", scriptContent, options);

    return content.replace(scriptRegex, `<script>${code}</script>`);
  }

  return content;
}

function riot(
  options?: CompilerOptions & {
    include?: FilterPattern;
    exclude?: FilterPattern;
    ext?: string | string[];
    transformOptions?: TransformOptions;
  },
): {
  name: "riot-plugin";
  transform(src: string | ParserOutput, id: string): void;
} {
  // clone options
  options = Object.assign({}, options);

  const filter = getFilter(options);

  // drop properties not necessary for Riot compiler
  ["ext", "include", "parsers", "sourcemap"].forEach((key) => {
    delete options[key];
  });

  return {
    name: "riot-plugin",
    transform(src: string, id: string) {
      if (!filter(id)) {
        return null;
      }

      src = transformScriptContent(src, options.transformOptions);

      const { code, map } = compile(src, {
        file: id,
        ...options,
      });

      return { code, map };
    },
  };
}

export { riot };
export default riot;
