import { dashToCamelCase } from './strings.js'

/**
 * Get all the element attributes as object
 * @param   {HTMLElement} element - DOM node we want to parse
 * @returns {Record<string, string>} all the attributes found as a key value pairs
 */
export function DOMattributesToObject(
  element: HTMLElement,
): Record<string, string> {
  return Array.from(element.attributes).reduce(
    (acc: Record<string, string>, attribute: Attr) => {
      acc[dashToCamelCase(attribute.name)] = attribute.value
      return acc
    },
    {},
  )
}

/**
 * Move all the child nodes from a source tag to another
 * @param   {HTMLElement} source - source node
 * @param   {HTMLElement} target - target node
 * @returns {void} it's a void method ¯\_(ツ)_/¯
 */
export function moveChildren(source: HTMLElement, target: HTMLElement): void {
  while (source.firstChild) {
    target.appendChild(source.firstChild)
  }
}

/**
 * Remove the child nodes from any DOM node
 */
export function cleanNode(node: HTMLElement): void {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

/**
 * Clear multiple children in a node
 */
export function clearChildren(children: HTMLElement[]): void {
  for (let i = 0; i < children.length; i++) removeChild(children[i])
}

/**
 * Remove a node
 */
export const removeChild = (node: HTMLElement): void => node.remove()

/**
 * Insert before a node
 */
export const insertBefore = (
  newNode: HTMLElement,
  refNode: HTMLElement,
): void => {
  refNode &&
    refNode.parentNode &&
    refNode.parentNode.insertBefore(newNode, refNode)
}

/**
 * Replace a node
 */
export const replaceChild = (
  newNode: HTMLElement,
  replaced: HTMLElement,
): void => {
  replaced &&
    replaced.parentNode &&
    replaced.parentNode.replaceChild(newNode, replaced)
}
