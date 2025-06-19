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
  return ['dependencies', 'peerDependencies']
    .map((key) =>
      Object.keys(pkg[key] || {}).map((dep) => new RegExp(`^${dep}`)),
    )
    .flat()
}

export const outputs: OutputOptions[] = [
  {
    dir: 'dist/module',
    format: 'esm',
    preserveModules: true,
    sourcemap: true,
  },
  {
    dir: 'dist/node',
    format: 'cjs',
    entryFileNames: () => '[name].cjs',
    preserveModules: true,
    sourcemap: true,
  },
]
