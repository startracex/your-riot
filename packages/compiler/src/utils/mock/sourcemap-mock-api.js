// mock the sourcemaps api for the browser bundle
// we do not need sourcemaps with the in browser compilation
const noop = () => {}

export const SourceMapGenerator = () => ({
  addMapping: noop,
  setSourceContent: noop,
  toJSON: () => ({}),
})
export const SourceMapConsumer = () => {}
export const SourceNode = () => {}

export default {
  SourceNode,
  SourceMapConsumer,
  SourceMapGenerator,
}
