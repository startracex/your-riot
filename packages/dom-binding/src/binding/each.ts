import { insertBefore, removeChild } from "@your-riot/utils/dom";
import { defineProperty } from "@your-riot/utils/objects";
import { isTemplate } from "@your-riot/utils/checks";
import createTemplateMeta from "../utils/create-template-meta.js";
import udomdiff from "../utils/udomdiff.js";
import type { TemplateChunk } from "../template.js";

const UNMOUNT_SCOPE: unique symbol = Symbol("unmount");

/**
 * Patch the DOM while diffing
 * @param   {any[]} redundant - list of all the children (template, nodes, context) added via each
 * @param   {*} parentScope - scope of the parent template
 * @returns {Function} patch function used by domdiff
 */
function patch(redundant, parentScope) {
  return (item, info) => {
    if (info < 0) {
      // get the last element added to the childrenMap saved previously
      const element = redundant[redundant.length - 1];

      if (element) {
        // get the nodes and the template in stored in the last child of the childrenMap
        const { template, nodes, context } = element;
        // remove the last node (notice <template> tags might have more children nodes)
        nodes.pop();

        // notice that we pass null as last argument because
        // the root node and its children will be removed by domdiff
        if (!nodes.length) {
          // we have cleared all the children nodes and we can unmount this template
          redundant.pop();
          template.unmount(context, parentScope, null);
        }
      }
    }

    return item;
  };
}

/**
 * Check whether a template must be filtered from a loop
 * @param   {Function} condition - filter function
 * @param   {Object} context - argument passed to the filter function
 * @returns {boolean} true if this item should be skipped
 */
function mustFilterItem(condition, context) {
  return condition ? !condition(context) : false;
}

/**
 * Extend the scope of the looped template
 * @param   {Object} scope - current template scope
 * @param   {Object} options - options
 * @param   {string} options.itemName - key to identify the looped item in the new context
 * @param   {string} options.indexName - key to identify the index of the looped item
 * @param   {number} options.index - current index
 * @param   {*} options.item - collection item looped
 * @returns {Object} enhanced scope object
 */
function extendScope(scope, { itemName, indexName, index, item }) {
  defineProperty(scope, itemName, item);
  if (indexName) {
    defineProperty(scope, indexName, index);
  }

  return scope;
}

/**
 * Loop the current template items
 * @param   {Array} items - expression collection value
 * @param   {*} scope - template scope
 * @param   {*} parentScope - scope of the parent template
 * @param   {EachBinding} binding - each binding object instance
 * @returns {Object} data
 * @returns {Map} data.newChildrenMap - a Map containing the new children template structure
 * @returns {Array} data.batches - array containing the template lifecycle functions to trigger
 * @returns {Array} data.futureNodes - array containing the nodes we need to diff
 */
function createPatch(items, scope, parentScope, binding) {
  const {
    condition,
    template,
    childrenMap,
    itemName,
    getKey,
    indexName,
    root,
    isTemplateTag,
  } = binding;
  const newChildrenMap = new Map();
  const batches = [];
  const futureNodes = [];

  items.forEach((item, index) => {
    const context = extendScope(Object.create(scope), {
      itemName,
      indexName,
      index,
      item,
    });
    const key = getKey ? getKey(context) : index;
    const oldItem = childrenMap.get(key);
    const nodes = [];

    if (mustFilterItem(condition, context)) {
      return;
    }

    const mustMount = !oldItem;
    const componentTemplate = oldItem ? oldItem.template : template.clone();
    const el = componentTemplate.el || root.cloneNode();
    const meta =
      isTemplateTag && mustMount
        ? createTemplateMeta(componentTemplate)
        : componentTemplate.meta;

    if (mustMount) {
      batches.push(() =>
        componentTemplate.mount(el, context, parentScope, meta),
      );
    } else {
      batches.push(() => componentTemplate.update(context, parentScope));
    }

    // create the collection of nodes to update or to add
    // in case of template tags we need to add all its children nodes
    if (isTemplateTag) {
      nodes.push(...meta.children);
    } else {
      nodes.push(el);
    }

    // delete the old item from the children map
    childrenMap.delete(key);
    futureNodes.push(...nodes);

    // update the children map
    newChildrenMap.set(key, {
      nodes,
      template: componentTemplate,
      context,
      index,
    });
  });

  return {
    newChildrenMap,
    batches,
    futureNodes,
  };
}

export class EachBinding<
  Scope = any,
  ItemName extends string = string,
  IndexName extends string = string,
  ItemValue = any,
  ExtendedScope = Scope & { [Property in ItemName]: ItemValue } & {
    [Property in IndexName]: number;
  },
> {
  isTemplateTag: boolean;
  itemName: ItemName;
  indexName?: IndexName | null;
  template: TemplateChunk<ExtendedScope>;
  getKey?: ((scope: ExtendedScope) => any) | null;
  condition?: ((scope: ExtendedScope) => any) | null;
  evaluate?: (scope: Scope) => ItemValue[];
  selector?: string;
  redundantAttribute?: string;
  node: Node;
  root: Node;
  placeholder: Text;
  nodes: Node[];
  childrenMap: Map<any, Node>;
  constructor(
    node: HTMLElement,
    {
      evaluate,
      condition,
      itemName,
      indexName,
      getKey,
      template,
    }: {
      itemName: ItemName;
      indexName?: IndexName | null;
      template: TemplateChunk<ExtendedScope>;
      getKey?: ((scope: ExtendedScope) => any) | null;
      condition?: ((scope: ExtendedScope) => any) | null;
      evaluate?: (scope: Scope) => ItemValue[];
    },
  ) {
    const placeholder = document.createTextNode("");
    const root = node.cloneNode();

    insertBefore(placeholder, node);
    removeChild(node);

    this.childrenMap = new Map();
    this.node = node;
    this.root = root;
    this.condition = condition;
    this.evaluate = evaluate;
    this.template = template.createDOM(node);
    this.isTemplateTag = isTemplate(root);
    this.nodes = [];
    this.getKey = getKey;
    this.indexName = indexName;
    this.itemName = itemName;
    this.placeholder = placeholder;
  }

  mount(scope: Scope, parentScope: any): this {
    return this.update(scope, parentScope);
  }

  update(scope: Scope | typeof UNMOUNT_SCOPE, parentScope: any): this {
    const { placeholder, nodes, childrenMap } = this;
    const collection = scope === UNMOUNT_SCOPE ? null : this.evaluate(scope);
    const items = collection ? Array.from(collection) : [];

    // prepare the diffing
    const { newChildrenMap, batches, futureNodes } = createPatch(
      items,
      scope,
      parentScope,
      this,
    );

    // patch the DOM only if there are new nodes
    udomdiff(
      nodes,
      futureNodes,
      patch(Array.from(childrenMap.values()), parentScope),
      placeholder,
    );

    // trigger the mounts and the updates
    batches.forEach((fn) => fn());

    // update the children map
    this.childrenMap = newChildrenMap;
    this.nodes = futureNodes;

    return this;
  }

  unmount(scope: Scope, parentScope: any): this {
    this.update(UNMOUNT_SCOPE as any, parentScope);

    return this;
  }
}

export default function create(node: any, options: any): EachBinding {
  return new EachBinding(node, options);
}
