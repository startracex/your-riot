import { globSync } from 'glob'
import pkg from './package.json'
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: globSync(['src/**/*.js']),
  external: Object.keys(pkg.dependencies).map((dep) => new RegExp(`^${dep}`)),
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
