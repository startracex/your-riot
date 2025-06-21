import {
  compile,
  registerPostprocessor,
  registerPreprocessor,
} from '../compiler'

// compile without options
compile('<my-tag><p>hello</p></my-tag>')

// compile with options
compile('<my-tag><p>hello</p></my-tag>', {
  file: 'test-file.riot',
  scopedCss: true,
})

registerPostprocessor((code) => ({
  code: code.toUpperCase(),
}))

registerPreprocessor('javascript', 'upper', (code) => ({
  code: code.toUpperCase(),
}))
