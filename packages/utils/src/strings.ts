export function camelToDashCase(string: string): string {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function dashToCamelCase(string: string): string {
  return string.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}
