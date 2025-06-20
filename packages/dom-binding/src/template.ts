import { cleanNode, clearChildren, removeChild } from '@your-riot/utils/dom'
import { IS_PURE_SYMBOL } from '@your-riot/utils/constants'
import createBinding from './binding.js'
import createDOMTree from './utils/create-dom-tree.js'
import injectDOM from './utils/inject-dom.js'
import { isTemplate } from '@your-riot/utils/checks'
import { panic } from '@your-riot/utils/misc'
import type { Binding, BindingData } from './types.js'

export interface TemplateChunkMeta {
  fragment?: DocumentFragment
  children?: Node[]
  avoidDOMInjection?: boolean
  head?: Node
  tail?: Node
}

/**
 * Create the Template DOM skeleton.
 */
function createTemplateDOM(el: HTMLElement, html: string | HTMLElement) {
  return html && (typeof html === 'string' ? createDOMTree(el, html) : html)
}

/**
 * Get the offset of the <template> tag.
 */
function getTemplateTagOffset(
  parentNode: ParentNode,
  el: Node,
  meta: TemplateChunkMeta,
) {
  const siblings = Array.from(parentNode.childNodes) as Node[]

  return Math.max(siblings.indexOf(el), siblings.indexOf(meta.head) + 1, 0)
}

/**
 * Template Chunk class
 */
export class TemplateChunk<Scope = any, ParentScope = any> {
  bindings?: Binding<Scope, ParentScope>[]
  bindingsData?: BindingData<Scope>[]
  html?: string | HTMLElement
  isTemplateTag?: boolean
  fragment?: DocumentFragment
  children?: { [index: number]: Node }
  dom?: HTMLElement | DocumentFragment
  el?: HTMLElement
  meta: TemplateChunkMeta
  constructor(html: string | HTMLElement, bindings: BindingData[] = []) {
    this.html = html
    this.bindingsData = bindings
    this.bindings = null
    this.isTemplateTag = false
    this.fragment = null
    this.children = null
    this.dom = null
    this.el = null
    this.meta = {}
  }

  /**
   * Create the template DOM structure that will be cloned on each mount.
   */
  createDOM(el: HTMLElement): this {
    // make sure that the DOM gets created before cloning the template
    this.dom =
      this.dom ||
      createTemplateDOM(el, this.html) ||
      document.createDocumentFragment()
    return this
  }

  /**
   * Attach the template to a DOM node.
   */
  mount(
    el: HTMLElement,
    scope: Scope,
    parentScope?: ParentScope,
    meta: TemplateChunkMeta = {},
  ): this {
    if (!el) panic('Please provide DOM node to mount properly your template')

    if (this.el) this.unmount(scope)

    // <template> tags require a bit more work
    // the template fragment might be already created via meta outside of this call
    const { fragment, children, avoidDOMInjection } = meta
    // <template> bindings of course can not have a root element
    // so we check the parent node to set the query selector bindings
    const { parentNode } = children ? children[0] : el
    const isTemplateTag = isTemplate(el)
    const templateTagOffset = isTemplateTag
      ? getTemplateTagOffset(parentNode, el, meta)
      : null

    // create the DOM if it wasn't created before
    this.createDOM(el)

    // create the DOM of this template cloning the original DOM structure stored in this instance
    // notice that if a documentFragment was passed (via meta) we will use it instead
    const cloneNode = fragment || this.dom.cloneNode(true)

    // store root node
    // notice that for template tags the root note will be the parent tag
    this.el = isTemplateTag ? (parentNode as HTMLElement) : el

    // create the children array only for the <template> fragments
    this.children = isTemplateTag
      ? children || Array.from(cloneNode.childNodes)
      : null

    // inject the DOM into the el only if a fragment is available
    if (!avoidDOMInjection && cloneNode) injectDOM(el, cloneNode as HTMLElement)

    // create the bindings
    this.bindings = this.bindingsData.map((binding) =>
      createBinding(this.el, binding, templateTagOffset),
    )
    this.bindings.forEach((b) => b.mount(scope as any, parentScope as any))

    // store the template meta properties
    this.meta = meta

    return this
  }

  /**
   * Update the template with fresh data.
   */
  update(scope: Scope, parentScope?: ParentScope): this {
    this.bindings.forEach((b) => b.update(scope, parentScope))
    return this
  }

  /**
   * Remove the template from the node where it was initially mounted.
   */
  unmount(
    scope: Scope,
    parentScope?: ParentScope,
    mustRemoveRoot: boolean = false,
  ): Binding<Scope, ParentScope> {
    const el = this.el

    if (!el) {
      return this
    }

    this.bindings.forEach((b) => b.unmount(scope, parentScope, mustRemoveRoot))

    switch (true) {
      // pure components should handle the DOM unmount updates by themselves
      // for mustRemoveRoot === null don't touch the DOM
      case el[IS_PURE_SYMBOL] || mustRemoveRoot === null:
        break

      // if children are declared, clear them
      // applicable for <template> and <slot/> bindings
      case Array.isArray(this.children):
        clearChildren(this.children)
        break

      // clean the node children only
      case !mustRemoveRoot:
        cleanNode(el)
        break

      // remove the root node only if the mustRemoveRoot is truly
      case !!mustRemoveRoot:
        removeChild(el)
        break
    }

    this.el = null
    return this
  }

  /**
   * Clone the template chunk.
   */
  clone(): this {
    const clone = new TemplateChunk(this.html, this.bindingsData) as this
    clone.bindings = this.bindings
    clone.isTemplateTag = this.isTemplateTag
    clone.fragment = this.fragment
    clone.children = this.children
    clone.dom = this.dom
    // el is intentionally set to null
    return clone
  }
}

/**
 * Create a template chunk wiring also the bindings.
 */
export default function create<S = any>(
  html: string,
  bindings: BindingData[] = [],
): TemplateChunk<S> {
  return new TemplateChunk(html, bindings)
}
