import type { TemplateChunk } from '@your-riot/dom-binding'
import type { RiotComponentWrapper, RiotComponent } from '../../riot'

declare const testWrapper: RiotComponentWrapper<RiotComponent>
testWrapper.template!(null as any, null as any, null as any, () => {
  return () => {
    return {} as TemplateChunk
  }
})
testWrapper.template!(
  null as any,
  null as any,
  null as any,
  //@ts-expect-error
  (componentName) => {
    return `${componentName}: this will throw an error`
  },
)
