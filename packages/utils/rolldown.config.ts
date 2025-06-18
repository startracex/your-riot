import { globSync } from 'glob'
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: globSync(['src/**/*.ts'], {
    ignore: '**/*.spec.js',
  }),
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
