import { dashToCamelCase } from './strings.js'

/**
 * Get all the element attributes as object.
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
 * Move all the child nodes from a source tag to another.
 */
export function moveChildren(source: Node, target: Node): void {
  while (source.firstChild) {
    target.appendChild(source.firstChild)
  }
}

/**
 * Remove the child nodes from any DOM node.
 */
export function cleanNode(node: Node): void {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

/**
 * Clear multiple children in a node.
 */
export function clearChildren(children: Element[]): void {
  for (let i = 0; i < children.length; i++) removeChild(children[i])
}

/**
 * Remove a node.
 */
export const removeChild = (node: Element): void => node.remove()

/**
 * Insert before a node.
 */
export const insertBefore = (newNode: Node, refNode: Node): void => {
  refNode &&
    refNode.parentNode &&
    refNode.parentNode.insertBefore(newNode, refNode)
}

/**
 * Replace a node.
 */
export const replaceChild = (newNode: Node, replaced: Node): void => {
  replaced &&
    replaced.parentNode &&
    replaced.parentNode.replaceChild(newNode, replaced)
}
