import { compile } from '@your-riot/compiler'

// Only module format is supported
const format = 'module'
// Allow the use of custom file extensions https://github.com/riot/register/issues/3
const FILE_EXTENSION_REGEX = new RegExp(
  // @ts-ignore
  `${process.env.RIOT_COMPONENTS_FILE_EXTENSION || '.riot'}$`,
)

import type { LoadHook, LoadHookContext, LoadFnOutput } from 'node:module'

export const load: LoadHook = async (
  url: string,
  context: LoadHookContext,
  nextLoad: LoadHook,
): Promise<LoadFnOutput> => {
  if (!FILE_EXTENSION_REGEX.test(url)) {
    return nextLoad(url, context, undefined)
  }

  // get the source code of the riot file
  const { source } = await nextLoad(
    url,
    {
      ...context,
      format,
    },
    undefined,
  )

  // compile the code and generate the esm output
  const { code } = compile(source.toString(), { file: url })

  return {
    format,
    shortCircuit: true,
    source: code,
  }
}
