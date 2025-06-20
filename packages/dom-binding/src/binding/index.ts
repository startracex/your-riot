import bindingTypes from '@your-riot/utils/binding-types.js'
import EachBinding from './each.ts'
import IfBinding from './if.ts'
import SimpleBinding from './simple.ts'
import SlotBinding from './slot.ts'
import TagBinding from './tag.ts'

const _default_1: {
  1: typeof IfBinding
  2: typeof SimpleBinding
  0: typeof EachBinding
  3: typeof TagBinding
  4: typeof SlotBinding
} = {
  [bindingTypes.IF]: IfBinding,
  [bindingTypes.SIMPLE]: SimpleBinding,
  [bindingTypes.EACH]: EachBinding,
  [bindingTypes.TAG]: TagBinding,
  [bindingTypes.SLOT]: SlotBinding,
}
export default _default_1
