export function checkType(
  element: any,
  type:
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function",
): boolean {
  return typeof element === type;
}

export function isSvg(el: any): el is SVGElement {
  const owner = el.ownerSVGElement;

  return !!owner || owner === null;
}

export function isTemplate(el: any): el is HTMLTemplateElement {
  return el.tagName.toLowerCase() === "template";
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return checkType(value, "function");
}

export function isBoolean(value: any): value is boolean {
  return checkType(value, "boolean");
}

export function isObject(value: any): value is object {
  return !isNil(value) && value.constructor === Object;
}

export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined;
}

export function isNode(): boolean {
  return typeof globalThis.process !== "undefined";
}
