import expressionTypes from "./expression-types.js";
import { dashToCamelCase } from "./strings.js";

/**
 * Throw an error with a descriptive message.
 */
export function panic(message: string, cause?: string): void {
  throw new Error(message, { cause });
}

/**
 * Returns the memoized (cached) function.
 */
export function memoize<T extends (...args: any[]) => any>(
  this: any,
  fn: T,
): T {
  const cache = new Map();
  const cached = (val) => {
    return cache.has(val)
      ? cache.get(val)
      : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached as any as T;
}

/**
 * Evaluate a list of attribute expressions.
 */
export function evaluateAttributeExpressions(
  attributes: {
    value: any;
    type: number;
    name: string;
  }[],
): {
  value: any;
  type: number;
  name: string;
}[] {
  return attributes.reduce((acc, attribute) => {
    const { value, type } = attribute;

    switch (true) {
      // ref attributes shouldn't be evaluated in the props
      case attribute.type === expressionTypes.REF:
        break;
      // spread attribute
      case !attribute.name && type === expressionTypes.ATTRIBUTE:
        return {
          ...acc,
          ...value,
        };
      // value attribute
      case type === expressionTypes.VALUE:
        acc.value = attribute.value;
        break;
      // normal attributes
      default:
        acc[dashToCamelCase(attribute.name)] = attribute.value;
    }

    return acc;
  }, {} as any);
}
