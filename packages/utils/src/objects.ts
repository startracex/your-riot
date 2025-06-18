import { isObject } from './checks.js'

/**
 * Helper function to set an immutable property
 */
export function defineProperty<T extends object>(
  source: T,
  key: PropertyKey,
  value: any,
  options: PropertyDescriptor = {},
): T {
  Object.defineProperty(source, key, {
    value,
    enumerable: false,
    writable: false,
    configurable: true,
    ...options,
  })
  return source
}

/**
 * Define multiple properties on a target object
 */
export function defineProperties(
  source: object,
  properties: Record<PropertyKey, any>,
  options: PropertyDescriptor,
): object {
  Object.entries(properties).forEach(([key, value]) => {
    defineProperty(source, key, value, options)
  })

  return source
}

/**
 * Define default properties if they don't exist on the source object
 */
export function defineDefaults(source: object, defaults: object): object {
  Object.entries(defaults).forEach(([key, value]) => {
    if (!source[key]) source[key] = value
  })
  return source
}

/**
 * Simple clone deep function, do not use it for classes or recursive objects
 */
export function cloneDeep<T>(source: T): T {
  return structuredClone(source)
}

/**
 * Like Array.prototype.filter but for objects
 */
export function filter<T extends object>(
  source: T,
  filter: (key: PropertyKey, value: any) => boolean,
): T {
  return isObject(source)
    ? (Object.fromEntries(
        Object.entries(source).filter(([key, value]) => filter(key, value)),
      ) as T)
    : source
}

/**
 * Generate a new object picking only the properties from a given array
 */
export function pick<T extends object, K extends keyof T>(
  source: T,
  keys: K[],
): Pick<T, K> {
  return isObject(source)
    ? (Object.fromEntries(keys.map((key) => [key, source[key]])) as Pick<T, K>)
    : source
}
