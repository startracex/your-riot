import { isSvg, isTemplate } from '@your-riot/utils/checks'
import { moveChildren } from '@your-riot/utils/dom'

/**
 * Inject the DOM tree into a target node.
 */
export default function injectDOM(el: HTMLElement, dom: HTMLElement): void {
  switch (true) {
    case isSvg(el):
      moveChildren(dom, el)
      break
    case isTemplate(el):
      el.parentNode.replaceChild(dom, el)
      break
    default:
      el.appendChild(dom)
  }
}
