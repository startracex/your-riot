import * as compiler from '@your-riot/compiler/essential'

export async function compileFromUrl(url, options) {
  const response = await fetch(url)

  const code = await response.text()

  return compiler.compile(code, { file: url, ...options })
}
