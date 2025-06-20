import { isNil } from '@your-riot/utils/checks'

/**
 * Normalize the user value in order to render a empty string in case of falsy values.
 */
export default function normalizeStringValue(value: any): string {
  return isNil(value) ? '' : value
}
