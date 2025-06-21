import { insertBefore, removeChild } from '@your-riot/utils/dom'
import { TemplateChunk } from '../template.js'
import { AttributeExpressionData } from '../types.js'

/**
 * Binding responsible for the `if` directive
 */
export class IfBinding<Scope = any, ParentScope = any> {
  template?: TemplateChunk<Scope>
  attributes: AttributeExpressionData<Scope>[]
  name: string
  node: HTMLElement
  templateData: any
  evaluate?: (scope: Scope) => any
  isTemplateTag: boolean
  placeholder: Text
  value: any
  constructor(
    node: HTMLElement,
    {
      evaluate,
      template,
    }: {
      evaluate: (scope: Scope) => any
      template?: TemplateChunk<Scope>
    },
  ) {
    this.node = node
    this.evaluate = evaluate
    this.isTemplateTag = node.tagName === 'TEMPLATE'
    this.placeholder = document.createTextNode('')
    this.template = template.createDOM(node)
    this.value = undefined

    insertBefore(this.placeholder, node)
    removeChild(node)
  }

  mount(scope: Scope, parentScope: ParentScope): this {
    return this.update(scope, parentScope)
  }

  update(scope: Scope, parentScope: ParentScope): this {
    const value = !!this.evaluate(scope)
    const mustMount = !this.value && value
    const mustUnmount = this.value && !value

    const mount = () => {
      const pristine = this.node.cloneNode() as HTMLElement
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

  unmount(scope: Scope, parentScope: ParentScope): this {
    this.template.unmount(scope, parentScope, true)
    return this
  }
}

export default function create<Scope = any>(
  node: HTMLElement,
  options: {
    evaluate: (scope: Scope) => any
    template?: TemplateChunk<Scope>
  },
): IfBinding<Scope> {
  return new IfBinding(node, options)
}
