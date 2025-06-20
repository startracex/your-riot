import {
  isBoolean as checkIfBoolean,
  isFunction,
  isObject,
} from '@your-riot/utils/checks'
import { memoize } from '@your-riot/utils/misc'
import { Expression } from '../types.js'

/* c8 ignore next */
const ElementProto = typeof Element === 'undefined' ? {} : Element.prototype
const isNativeHtmlProperty = memoize(
  (name) => ElementProto.hasOwnProperty(name), // eslint-disable-line
)

/**
 * Add all the attributes provided.
 */
function setAllAttributes(node: HTMLElement, attributes: Record<string, any>) {
  Object.keys(attributes).forEach((name) =>
    attributeExpression({ node, name }, attributes[name]),
  )
}

/**
 * Remove all the attributes provided.
 */
function removeAllAttributes(
  node: HTMLElement,
  newAttributes: Record<string, any>,
  oldAttributes: Record<string, any>,
) {
  const newKeys = newAttributes ? Object.keys(newAttributes) : []

  Object.keys(oldAttributes)
    .filter((name) => !newKeys.includes(name))
    .forEach((attribute) => node.removeAttribute(attribute))
}

const _canRender = ['string', 'number', 'boolean']

/**
 * Check whether the attribute value can be rendered.
 */
function canRenderAttribute(value: any): value is string | number | boolean {
  return _canRender.includes(typeof value)
}

/**
 * Check whether the attribute should be removed.
 */
function shouldRemoveAttribute(value: number, isBoolean: boolean): boolean {
  // boolean attributes should be removed if the value is falsy
  if (isBoolean) {
    return !value && value !== 0
  }
  // otherwise we can try to render it
  return typeof value === 'undefined' || value === null
}

/**
 * This methods handles the DOM attributes updates.
 */
export default function attributeExpression(
  { node, name, isBoolean, value: oldValue }: Expression,
  value: any,
): void {
  // is it a spread operator? {...attributes}
  if (!name) {
    if (oldValue) {
      // remove all the old attributes
      removeAllAttributes(node, value, oldValue)
    }

    // is the value still truthy?
    if (value) {
      setAllAttributes(node, value)
    }

    return
  }

  // store the attribute on the node to make it compatible with native custom elements
  if (
    !isNativeHtmlProperty(name) &&
    (checkIfBoolean(value) || isObject(value) || isFunction(value))
  ) {
    node[name] = value
  }

  if (shouldRemoveAttribute(value, isBoolean)) {
    node.removeAttribute(name)
  } else if (canRenderAttribute(value)) {
    node.setAttribute(name, normalizeValue(name, value, isBoolean))
  }
}

/**
 * Get the value as string.
 */
function normalizeValue(name: string, value: any, isBoolean: boolean) {
  // be sure that expressions like selected={ true } will always be rendered as selected='selected'
  // fix https://github.com/riot/riot/issues/2975
  return value === true && isBoolean ? name : value
}
