import { expect } from 'chai'
import { rollup } from 'rollup'
import fs from 'fs/promises'
import { registerPreprocessor } from '@your-riot/compiler'
import path from 'node:path'
import riot from '../dist/module/index.js'
import cssnext from './helper/cssnext.js'

describe('rollup-plugin-riot', function () {
  const fixturesDir = path.join(process.cwd(), 'test', 'fixtures'),
    expectDir = path.join(process.cwd(), 'test', 'expect')

  async function readExpectedString(name) {
    const content = await fs.readFile(
      path.join(expectDir, name.replace('.js', '.txt')),
      'utf8',
    )
    console.log({
      path: path.join(expectDir, name.replace('.js', '.txt')),
      content,
    })
    return content.replaceAll('\r', '')
  }

  function rollupRiot(filename, riotOpts, sourcemap) {
    const opts = {
      input: path.join(fixturesDir, filename),
      plugins: [riot(riotOpts || {})],
    }

    return rollup(opts)
      .then((b) =>
        b.generate({
          format: 'es',
          sourcemap,
        }),
      )
      .then(({ output }) => {
        const result = output[0]
        return sourcemap ? result : result.code.replaceAll('\r', '')
      })
  }

  it('single tag', function () {
    const filename = 'single.js'

    return Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ]).then(([result, expected]) => {
      expect(result).to.have.string(expected)
    })
  })

  it('multiple tag', function () {
    const filename = 'multiple.js'

    return Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ]).then(([result, expected]) => {
      expect(result).to.have.string(expected)
    })
  })

  it('multiple tag in single file', function () {
    const filename = 'multiple2.js'

    return Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ]).then(([result, expected]) => {
      expect(result).to.have.string(expected)
    })
  })

  it('tag with another extension', function () {
    const filename = 'another-ext.js'
    const opts = { ext: 'html' }

    return Promise.all([
      rollupRiot(filename, opts),
      readExpectedString(filename),
    ]).then(([result, expected]) => {
      expect(result).to.have.string(expected)
    })
  })

  it('compiles with custom parsers', async function () {
    const filename = 'custom-parsers.js'
    registerPreprocessor('css', 'cssnext', cssnext)

    return Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ]).then(([result, expected]) => {
      expect(result).to.have.string(expected)
    })
  })

  it('compiles with sourcemaps', function () {
    const filename = 'single.js'
    const opts = { sourcemap: true, globals: { riot: 'riot' } }

    return rollupRiot(filename, opts, true).then((result) => {
      expect(result).to.be.an('object')
      expect(result).to.include.keys('map')
      expect(result.map).to.be.an('object')
    })
  })
})
