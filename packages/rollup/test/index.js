import { expect } from 'chai'
import { rollup } from 'rollup'
import fs from 'fs/promises'
import { registerPreprocessor } from '@your-riot/compiler'
import path from 'node:path'
import riot from '../dist/module/index.js'
import cssnext from './helper/cssnext.js'

describe('rollup-plugin-riot', () => {
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

  async function rollupRiot(filename, riotOpts, sourcemap) {
    const opts = {
      input: path.join(fixturesDir, filename),
      plugins: [riot(riotOpts || {})],
    }

    const b = await rollup(opts)
    const { output } = await b.generate({
      format: 'es',
      sourcemap,
    })
    const result = output[0]
    return sourcemap ? result : result.code.replaceAll('\r', '')
  }

  it('single tag', async () => {
    const filename = 'single.js'

    const [result, expected] = await Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ])
    expect(result).to.have.string(expected)
  })

  it('multiple tag', async () => {
    const filename = 'multiple.js'

    const [result, expected] = await Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ])
    expect(result).to.have.string(expected)
  })

  it('multiple tag in single file', async () => {
    const filename = 'multiple2.js'

    const [result, expected] = await Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ])
    expect(result).to.have.string(expected)
  })

  it('tag with another extension', async () => {
    const filename = 'another-ext.js'
    const opts = { ext: 'html' }

    const [result, expected] = await Promise.all([
      rollupRiot(filename, opts),
      readExpectedString(filename),
    ])
    expect(result).to.have.string(expected)
  })

  it('compiles with custom parsers', async () => {
    const filename = 'custom-parsers.js'
    registerPreprocessor('css', 'cssnext', cssnext)

    return Promise.all([
      rollupRiot(filename),
      readExpectedString(filename),
    ]).then(([result, expected]) => {
      expect(result).to.have.string(expected)
    })
  })

  it('compiles with sourcemaps', async () => {
    const filename = 'single.js'
    const opts = { sourcemap: true, globals: { riot: 'riot' } }

    const result = await rollupRiot(filename, opts, true)
    expect(result).to.be.an('object')
    expect(result).to.include.keys('map')
    expect(result.map).to.be.an('object')
  })
})
