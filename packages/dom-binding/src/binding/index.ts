import bindingTypes from "@your-riot/utils/binding-types.js";
import EachBinding from "./each.js";
import IfBinding from "./if.js";
import SimpleBinding from "./simple.js";
import SlotBinding from "./slot.js";
import TagBinding from "./tag.js";

const _default_1: {
  1: typeof IfBinding;
  2: typeof SimpleBinding;
  0: typeof EachBinding;
  3: typeof TagBinding;
  4: typeof SlotBinding;
} = {
  [bindingTypes.IF]: IfBinding,
  [bindingTypes.SIMPLE]: SimpleBinding,
  [bindingTypes.EACH]: EachBinding,
  [bindingTypes.TAG]: TagBinding,
  [bindingTypes.SLOT]: SlotBinding,
};
export default _default_1;
