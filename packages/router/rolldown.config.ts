import pkg from './package.json'
import { defineConfig } from 'rolldown'
import { inputGlob, outputs, packageDependencies } from '../../rolldown.config'
import riot from '@your-riot/rollup-plugin'

export default defineConfig({
  input: inputGlob('src/**/*.ts','src/**/*.js'),
  external: packageDependencies(pkg),
  output: outputs,
  plugins: [riot()],
})
