import { globSync } from 'glob'
import pkg from './package.json'
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: globSync(['src/**/*.ts']),
  external: ['dependencies', 'peerDependencies']
    .map((key) =>
      Object.keys(pkg[key] || {}).map((dep) => new RegExp(`^${dep}`)),
    )
    .flat(),
  output: [
    {
      dir: 'dist/module',
      format: 'esm',
      preserveModules: true,
    },
    {
      dir: 'dist/node',
      format: 'cjs',
      entryFileNames: () => '[name].cjs',
      preserveModules: true,
    },
  ],
})
