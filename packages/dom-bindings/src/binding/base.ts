import { EACH, IF, SIMPLE, SLOT, TAG } from '@your-riot/utils/binding-types.js'
import { Expression } from '../types.js'

export class BaseBinding<Scope = any> {
  selector?: string
  redundantAttribute?: string
  type?: typeof EACH | typeof IF | typeof SIMPLE | typeof SLOT | typeof TAG
  node: Node
  evaluate?(scope: Scope): any
  constructor(node: Node) {
    this.node = node
  }
  declare mount?: (scope: Scope) => Expression<Scope>
  declare update?: (scope: Scope) => Expression<Scope>
  declare unmount?: (scope: Scope) => Expression<Scope>
  isBoolean?: boolean
}
