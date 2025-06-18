import formatError from './format-error.js'

export default function panic(data: string, msg: string, pos: number): void {
  const message = formatError(data, msg, pos)
  throw new Error(message)
}
