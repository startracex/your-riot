import { globSync } from 'glob'
import type { OutputOptions } from 'rolldown'

export const inputGlob = (...paths: string[]) => {
  const includes = []
  const exclude = []
  paths.forEach((path) => {
    if (path.startsWith('!')) {
      exclude.push(path.slice(1))
    } else {
      includes.push(path)
    }
  })
  return globSync(includes, {
    ignore: exclude,
  })
}

export const packageDependencies = (pkg: any): RegExp[] => {
  return [
    /^node:/,
    ...['dependencies', 'peerDependencies']
      .map((key) =>
        Object.keys(pkg[key] || {}).map((dep) => new RegExp(`^${dep}`)),
      )
      .flat(),
  ]
}

const commonOutput: OutputOptions = {
  preserveModules: true,
  sourcemap: true,
  minify: true,
}

export const outputs: OutputOptions[] = [
  {
    dir: 'dist/module',
    format: 'esm',
    exports: 'named',
    ...commonOutput,
  },
  {
    dir: 'dist/node',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    exports: 'named',
    ...commonOutput,
  },
]
