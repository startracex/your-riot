import { compile, CompilerOptions } from '@your-riot/compiler'
import { getFilter } from './helper'
import { ParserOutput } from '@your-riot/parser'
import type { FilterPattern } from '@rollup/pluginutils'

function riot(
  options: CompilerOptions & {
    include: FilterPattern
    exclude: FilterPattern
    ext: string | string[]
  },
): {} {
  // clone options
  options = Object.assign({}, options)

  const filter = getFilter(options)

  // drop properties not necessary for Riot compiler
  ;['ext', 'include', 'parsers', 'sourcemap'].forEach((key) => {
    delete options[key]
  })

  return {
    transform(src: string | ParserOutput, id: unknown) {
      if (!filter(id)) {
        return null
      }

      const { code, map } = compile(src, {
        // file: id,
        ...options,
      })

      return { code, map }
    },
  }
}

export { riot }
export default riot
