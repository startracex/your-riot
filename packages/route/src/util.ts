import { dashToCamelCase } from '@your-riot/utils/strings'
import { isNil } from '@your-riot/utils/checks'
import { __ } from '@your-riot/riot'
import type {
  AttributeExpressionData,
  TemplateChunk,
} from '@your-riot/dom-bindings'

export const getWindow = (): Window | null =>
  typeof window === 'undefined' ? null : window
export const getGlobal = (): typeof globalThis => globalThis

export const getDocument = (): Document | null =>
  typeof document === 'undefined' ? null : document

export const getHistory = (): History | null =>
  typeof history === 'undefined' ? null : history

export const getLocation = (): Location => {
  const win = getWindow()
  return win ? win.location : ({} as any)
}

export const defer: (callback: (...args: any[]) => any) => number = (() => {
  const globalScope = getGlobal()

  return globalScope.requestAnimationFrame || globalScope.setTimeout
})()

export const cancelDefer: (arg: number) => void = (() => {
  const globalScope = getGlobal()

  return globalScope.cancelAnimationFrame || globalScope.clearTimeout
})()

export const getAttribute = (
  attributes: any[],
  name: string,
  context: any,
): void => {
  if (!attributes) return null

  const normalizedAttributes = attributes.flatMap((attr) =>
    isNil(attr.name)
      ? // add support for spread attributes https://github.com/riot/route/issues/178
        Object.entries(attr.evaluate(context)).map(([key, value]) => ({
          // evaluate each value of the spread attribute and store it into the array
          name: key,
          // create a nested evaluate function pointing to the original value of the spread object
          evaluate: () => value,
        }))
      : attr,
  )

  return normalizedAttributes.find((a) => dashToCamelCase(a.name) === name)
}

export const createDefaultSlot = (
  attributes: AttributeExpressionData[] = [],
): TemplateChunk => {
  const { template, bindingTypes, expressionTypes } = __.DOMBindings

  return template(null, [
    {
      type: bindingTypes.SLOT,
      name: 'default',
      attributes: attributes.map((attr) => ({
        ...attr,
        type: expressionTypes.ATTRIBUTE,
      })),
    },
  ])
}

// True if the selector string is valid
export const isValidQuerySelectorString = (selector: string): boolean =>
  /^([a-zA-Z0-9-_*#.:[\]\s>+~()='"]|\\.)+$/.test(selector)
