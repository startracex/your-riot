import { isSvg, isTemplate } from '@your-riot/utils/checks'
import { moveChildren } from '@your-riot/utils/dom'

/**
 * Inject the DOM tree into a target node
 * @param   {HTMLElement} el - target element
 * @param   {DocumentFragment|SVGElement} dom - dom tree to inject
 * @returns {undefined}
 */
export default function injectDOM(el, dom) {
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
