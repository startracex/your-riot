import * as constants from '../dist/module/constants.js'
import { expect } from 'chai'

describe('Constants', function () {
  it('constants are properly exported', () => {
    expect(constants).to.be.ok
  })
})
