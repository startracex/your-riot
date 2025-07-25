import { cleanNode, insertBefore, removeChild } from "@your-riot/utils/dom";
import { PARENT_KEY_SYMBOL } from "@your-riot/utils/constants";
import { evaluateAttributeExpressions } from "@your-riot/utils/misc";
import template, { type TemplateChunk } from "../template.js";
import type { AttributeExpressionData } from "../types.js";

const extendParentScope = (attributes, scope, parentScope) => {
  if (!attributes || !attributes.length) {
    return parentScope;
  }

  const expressions = attributes.map((attr) => ({
    ...attr,
    value: attr.evaluate(scope),
  }));

  return Object.assign(
    Object.create(parentScope || null),
    evaluateAttributeExpressions(expressions),
  );
};

const findSlotById = (id, slots) => slots?.find((slot) => slot.id === id);

// this function is only meant to fix an edge case
// https://github.com/riot/riot/issues/2842
const getRealParent = (scope, parentScope) =>
  scope[PARENT_KEY_SYMBOL] || parentScope;

/**
 * Move the inner content of the slots outside of them
 * @param   {HTMLElement} slot - slot node
 * @returns {undefined} it's a void method ¯\_(ツ)_/¯
 */
function moveSlotInnerContent(slot) {
  const child = slot?.firstChild;

  if (!child) {
    return;
  }

  insertBefore(child, slot);
  moveSlotInnerContent(slot);
}

export class SlotBinding<Scope = any> {
  template?: TemplateChunk<Scope>;
  attributes: AttributeExpressionData<Scope>[];
  name: string;
  node: HTMLElement;
  templateData: any;
  constructor(
    node: any,
    {
      name,
      attributes,
      template,
    }: {
      name: string;
      attributes: AttributeExpressionData<Scope>[];
      template?: TemplateChunk<Scope>;
    },
  ) {
    this.node = node;
    this.name = name;
    this.attributes = attributes || [];
    this.template = template;
    this.templateData = null;
  }

  getTemplateScope(scope: any, parentScope: any): any {
    return extendParentScope(this.attributes, scope, parentScope);
  }

  // API methods
  mount(scope: any, parentScope: any): this {
    const templateData = scope.slots
      ? findSlotById(this.name, scope.slots)
      : false;
    const { parentNode } = this.node;

    // if the slot did not pass any content, we will use the self slot for optional fallback content (https://github.com/riot/riot/issues/3024)
    const realParent = templateData ? getRealParent(scope, parentScope) : scope;

    // if there is no html for the current slot detected we rely on the parent slots (https://github.com/riot/riot/issues/3055)
    this.templateData = templateData?.html
      ? templateData
      : findSlotById(this.name, realParent.slots);

    // override the template property if the slot needs to be replaced
    this.template =
      (this.templateData &&
        template(this.templateData.html, this.templateData.bindings).createDOM(
          parentNode as HTMLElement,
        )) ||
      // otherwise use the optional template fallback if provided by the compiler see also https://github.com/riot/riot/issues/3014
      this.template?.clone();

    if (this.template) {
      cleanNode(this.node);
      this.template.mount(
        this.node,
        this.getTemplateScope(scope, realParent),
        realParent,
      );
      this.template.children = Array.from(this.node.childNodes);
    }

    moveSlotInnerContent(this.node);
    removeChild(this.node);

    return this;
  }

  update(scope: any, parentScope: any): this {
    if (this.template) {
      const realParent = this.templateData
        ? getRealParent(scope, parentScope)
        : scope;

      this.template.update(
        this.getTemplateScope(scope, realParent),
        realParent,
      );
    }

    return this;
  }

  unmount(scope: any, parentScope: any, mustRemoveRoot: any): this {
    if (this.template) {
      this.template.unmount(
        this.getTemplateScope(scope, parentScope),
        null,
        mustRemoveRoot,
      );
    }

    return this;
  }
}

/**
 * Create a single slot binding instance
 * @param   {HTMLElement} node - slot node
 * @param   {string} name - slot id
 * @param   {AttributeExpressionData[]} attributes - slot attributes
 * @returns {SlotBinding} Slot binding instance
 */
export default function createSlot(
  node: HTMLElement,
  options: {
    name: string;
    attributes: AttributeExpressionData[];
  },
): SlotBinding {
  return new SlotBinding(node, options);
}
