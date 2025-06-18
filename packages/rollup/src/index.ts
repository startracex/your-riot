import { compile, CompilerOptions } from '@your-riot/compiler'
import { getFilter } from './helper'
import { ParserOutput } from '@your-riot/parser'
import type { FilterPattern } from '@rollup/pluginutils'

function riot(
  options?: CompilerOptions & {
    include: FilterPattern
    exclude: FilterPattern
    ext: string | string[]
  },
): {
  name: 'riot-plugin'
  transform(src: string | ParserOutput, id: string): void
} {
  // clone options
  options = Object.assign({}, options)

  const filter = getFilter(options)

  // drop properties not necessary for Riot compiler
  ;['ext', 'include', 'parsers', 'sourcemap'].forEach((key) => {
    delete options[key]
  })

  return {
    name: 'riot-plugin',
    transform(src: string | ParserOutput, id: string) {
      if (!filter(id)) {
        return null
      }

      const { code, map } = compile(src, {
        file: id,
        ...options,
      })

      return { code, map }
    },
  }
}

export { riot }
export default riot
