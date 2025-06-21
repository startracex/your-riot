import expressionTypes from '@your-riot/utils/expression-types'
import template, { type TemplateChunk } from '../template.js'
import type { AttributeExpressionData, TagSlotData } from '../types.js'

/**
 * Create a new tag object if it was registered before, otherwise fallback to the simple
 * template chunk
 * @param   {Function} component - component factory function
 * @param   {Array<Object>} slots - array containing the slots markup
 * @param   {Array} attributes - dynamic attributes that will be received by the tag element
 * @returns {TagImplementation|TemplateChunk} a tag implementation or a template chunk as fallback
 */
function getTag(component, slots = [], attributes = []): TemplateChunk {
  if (component) {
    return component({ slots, attributes })
  }

  return template(slotsToMarkup(slots), [
    ...slotBindings(slots),
    {
      expressions: attributes.map((attr) => {
        return {
          type: expressionTypes.ATTRIBUTE,
          ...attr,
        }
      }),
    },
  ])
}

/**
 * Merge all the slots bindings into a single array
 * @param   {Array<Object>} slots - slots collection
 * @returns {Array<Bindings>} flatten bindings array
 */
function slotBindings(slots) {
  return slots.reduce((acc, { bindings }) => acc.concat(bindings), [])
}

/**
 * Merge all the slots together in a single markup string
 * @param   {Array<Object>} slots - slots collection
 * @returns {string} markup of all the slots in a single string
 */
function slotsToMarkup(slots: any[]): string {
  return slots.reduce((acc, slot) => {
    return acc + slot.html
  }, '')
}

interface Options {
  evaluate: TagBinding['evaluate']
  getComponent: TagBinding['getComponent']
  slots: TagBinding['slots']
  attributes: TagBinding['attributes']
}

export class TagBinding<Scope = any, ParentScope = any> {
  node: HTMLElement
  slots: TagSlotData[]
  evaluate: (scope: Scope) => any
  attributes: AttributeExpressionData[]
  tag: TemplateChunk
  name: string
  getComponent: (
    name: string,
  ) => ({
    slots,
    attributes,
  }: {
    slots: TagSlotData<Scope>[]
    attributes: AttributeExpressionData<Scope>[]
  }) => Pick<TemplateChunk<Scope>, 'mount' | 'update' | 'unmount'>

  constructor(node: HTMLElement, options: Options) {
    this.node = node
    const { evaluate, getComponent, slots, attributes } = options
    this.evaluate = evaluate
    this.slots = slots || []
    this.attributes = attributes || []
    this.getComponent = getComponent
    this.name = null
    this.tag = null
  }

  mount(scope: Scope): this {
    return this.update(scope)
  }

  update(scope: Scope, parentScope?: ParentScope): this {
    const name = this.evaluate(scope)

    if (name && name === this.name) {
      this.tag.update(scope)
    } else {
      this.unmount(scope, parentScope, true)

      this.name = name
      this.tag = getTag(this.getComponent(name), this.slots, this.attributes)
      this.tag.mount(this.node, scope)
    }

    return this
  }

  unmount(scope: Scope, parentScope: ParentScope, keepRootTag?: boolean): this {
    if (this.tag) {
      this.tag.unmount(keepRootTag)
    }

    return this
  }
}

export default function create(
  node: HTMLElement,
  options: Options,
): TagBinding {
  return new TagBinding(node, options)
}
