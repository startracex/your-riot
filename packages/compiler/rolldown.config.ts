import pkg from './package.json'
import { defineConfig } from 'rolldown'
import { inputGlob, packageDependencies, outputs } from '../../rolldown.config'

export default defineConfig({
  input: inputGlob('src/**/*.js', 'src/**/*.json'),
  external: packageDependencies(pkg),
  output: outputs,
})
