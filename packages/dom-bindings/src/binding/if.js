import { insertBefore, removeChild } from '@your-riot/utils/dom'

/**
 * Binding responsible for the `if` directive
 */
export class IfBinding {
  constructor(node, { evaluate, template }) {
    this.node = node
    this.evaluate = evaluate
    this.isTemplateTag = node.tagName === 'TEMPLATE'
    this.placeholder = document.createTextNode('')
    this.template = template.createDOM(node)
    this.value = undefined

    insertBefore(this.placeholder, node)
    removeChild(node)
  }

  mount(scope, parentScope) {
    return this.update(scope, parentScope)
  }

  update(scope, parentScope) {
    const value = !!this.evaluate(scope)
    const mustMount = !this.value && value
    const mustUnmount = this.value && !value

    const mount = () => {
      const pristine = this.node.cloneNode()
      insertBefore(pristine, this.placeholder)
      this.template = this.template.clone()
      this.template.mount(pristine, scope, parentScope)
    }

    switch (true) {
      case mustMount:
        mount()
        break
      case mustUnmount:
        this.unmount(scope, parentScope)
        break
      default:
        if (value) this.template.update(scope, parentScope)
    }

    this.value = value
    return this
  }

  unmount(scope, parentScope) {
    this.template.unmount(scope, parentScope, true)
    return this
  }
}

export default function create(node, options) {
  return new IfBinding(node, options)
}
