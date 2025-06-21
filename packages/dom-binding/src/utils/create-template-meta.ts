import type { TemplateChunk, TemplateChunkMeta } from '../template.js'
import createHeadTailPlaceholders from './create-head-tail-placeholders.js'

/**
 * Create the template meta object in case of <template> fragments.
 */
export default function createTemplateMeta(
  componentTemplate: TemplateChunk,
): TemplateChunkMeta {
  const fragment = componentTemplate.dom.cloneNode(true) as DocumentFragment
  const { head, tail } = createHeadTailPlaceholders()

  return {
    avoidDOMInjection: true,
    fragment,
    head,
    tail,
    children: [head, ...Array.from(fragment.childNodes), tail],
  }
}
