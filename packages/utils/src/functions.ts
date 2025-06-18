import { isFunction } from './checks.js'

// does simply nothing
export function noop<T = any>(this: T): T {
  return this
}

/**
 * Autobind the methods of a source object to itself
 */
export function autobindMethods(
  source: object,
  methods: PropertyKey[],
): object {
  methods.forEach((method) => {
    source[method] = source[method].bind(source)
  })

  return source
}

/**
 * Call the first argument received only if it's a function otherwise return it as it is
 */
export function callOrAssign(source: any): any {
  return isFunction(source)
    ? source.prototype && source.prototype.constructor
      ? new (source as any)()
      : source()
    : source
}
