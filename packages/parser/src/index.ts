import * as constants from './constants.js'
import * as nodeTypes from './node-types.js'
import parser from './parser.js'

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
export type * from './types.js'
