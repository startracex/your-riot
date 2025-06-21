import { base, sleep } from './util.js'
import { router } from 'rawth'
import { getCurrentRoute } from '../dist/module/get-current-route.js'
import { expect } from 'chai'
import { normalizeBase, setBase } from '../dist/module/set-base.js'

describe('misc methods', () => {
  beforeEach(() => {
    setBase(`${base}#`)
  })

  it('getCurrentRoute returns properly the current router value', async () => {
    router.push(`${base}#/hello`)

    await sleep()

    expect(getCurrentRoute()).to.be.equal(`${base}#/hello`)
  })

  it('normalizeBase returns the expected paths', async () => {
    expect(normalizeBase('#')).to.be.equal(`${base}#`)
    expect(normalizeBase('/')).to.be.equal(`${base}`)
    expect(normalizeBase('')).to.be.equal(`${base}`)
    expect(normalizeBase('/hello')).to.be.equal(`${base}/hello`)
    expect(normalizeBase('hello')).to.be.equal(`${base}/hello`)
    expect(normalizeBase('http://google.com')).to.be.equal('http://google.com')
    expect(normalizeBase('/page#anchor')).to.be.equal(`${base}/page#anchor`)
  })
})
