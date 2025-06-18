import * as constants from './constants'
import * as nodeTypes from './node-types'
import parser from './parser'

export {
  /*
   * Factory function to create instances of the parser
   */
  parser,
  /**
   * The nodeTypes definition
   */
  nodeTypes,
  /**
   * Expose the internal constants
   */
  constants,
}

export default parser
