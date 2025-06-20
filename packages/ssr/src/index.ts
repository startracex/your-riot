import * as dom from './dom.ts'
import {
  __,
  component,
  DefaultProps,
  DefaultState,
  RiotComponent,
  RiotComponentWrapper,
} from '@your-riot/riot'
import curry from 'curri'

const { CSS_BY_NAME } = __.cssManager
const DOCTYPE_DECLARATION = '<!doctype html>'
const INPUT_ELEMENTS_SELECTOR = 'input,textarea,select,option'
const INPUT_PASSWORD_TYPE = 'password'
const ATTRIBUTE_TYPE_NAME = 'type'
const VALUE_ATTRIBUTE = 'value'

// check if a DOM node has the attribute type='password'
const hasPasswordAttributeType = (el) =>
  el.attributes.some(
    (attr) =>
      attr.name === ATTRIBUTE_TYPE_NAME && attr.value === INPUT_PASSWORD_TYPE,
  )

// defer callbacks if the rendering is async
const defer = (callback) =>
  globalThis.window && globalThis.window.requestAnimationFrame
    ? globalThis.window.requestAnimationFrame(callback)
    : setTimeout(callback)

// call the dispose method asynchronously for the async rendering
const handleDisposeCallback = (isAsync, dispose) =>
  isAsync ? defer(dispose) : dispose()

/**
 * Set the value attribute of all the inputs.
 */
function setUserInputAttributes(element: RiotComponent): HTMLElement[] {
  return element.$$(INPUT_ELEMENTS_SELECTOR).map(
    (
      el: HTMLElement & {
        value?: any
      },
    ) => {
      const value = hasPasswordAttributeType(el)
        ? ''
        : el.value || el.getAttribute(VALUE_ATTRIBUTE)

      el.setAttribute(VALUE_ATTRIBUTE, value || '')

      return el
    },
  )
}

interface RendererPayload {
  getHTML: () => string
  dispose: () => void
  element: RiotComponent & {
    onAsyncRendering?: (...args: any) => Promise<any>
  }
  getCSS: () => string
}

interface Renderer {
  (arg0: RendererPayload): any
}

/**
 * Create the renderer function that can produce different types of output from the DOM rendered.
 */
export function createRenderer(
  renderer: (arg0: RendererPayload) => any,
  tagName: string,
  componentAPI: RiotComponentWrapper<RiotComponent<DefaultProps, DefaultState>>,
  props: any = {},
): any {
  dom.create()

  const isRootNode = tagName === 'html'
  const root = document.createElement(tagName)
  const element = component(componentAPI)(root, {
    ...props,
    isServer: true,
  })

  const dispose = () => {
    // unmount the component
    element.unmount()
    // remove the old stored css
    CSS_BY_NAME.clear()
    // clear global scope
    dom.clear()
  }

  //reflect input value prop to attribute
  setUserInputAttributes(element)

  return renderer({
    // serialize the component outer html
    getHTML: () => `${isRootNode ? DOCTYPE_DECLARATION : ''}${root.outerHTML}`,
    dispose,
    element,
    // serialize all the generated css
    getCSS: () => [...CSS_BY_NAME.values()].join('\n'),
  })
}

/**
 * Get only the html string from a renderer function.
 */
const getOnlyHTMLFromRenderer = (
  { getHTML, dispose }: RendererPayload,
  isAsync: boolean,
): string => {
  const html = getHTML()
  handleDisposeCallback(isAsync, dispose)
  return html
}

/**
 * Get only the html string from a renderer function.
 */
const getFragmentsFromRenderer = (
  { getHTML, dispose, getCSS }: RendererPayload,
  isAsync,
): {
  html: string
  css: string
} => {
  const html = getHTML()
  const css = getCSS()
  handleDisposeCallback(isAsync, dispose)
  return { html, css }
}

/**
 * Async component rendering implementation
 * @param   {Function} renderer - rendering function
 * @param   {Object} rendererPayload - renderer function payload argument
 * @returns {Promise} value of the renderer function
 */
const renderComponentAsync = curry(
  (renderer: Renderer, rendererPayload: RendererPayload) => {
    const { element } = rendererPayload

    if (!element.onAsyncRendering)
      throw new Error(
        'Please provide the onAsyncRendering callback to SSR asynchronously your components',
      )

    const promise = new Promise((resolve, reject) => {
      const ret = element.onAsyncRendering(resolve, reject)

      if (ret && ret.then) {
        ret.then(resolve, reject)
      }
    })

    return Promise.race([
      promise.then(() => renderer(rendererPayload)),
      new Promise((resolve, reject) => {
        setTimeout(function () {
          reject(
            new Error(
              `Timeout error:: the component "${element.name}" didn't resolve the "onAsyncRendering" promise during the rendering process`,
            ),
          )
        }, asyncRenderTimeout)
      }),
    ])
  },
)

export const asyncRenderTimeout = 3000
export const domGlobals: typeof dom = dom
export const renderAsync: <Props extends unknown>(
  componentName: string,
  componentShell: RiotComponentWrapper<Props>,
  props?: Props,
) => Promise<string> =
  // @ts-ignore
  curry(createRenderer)(
    renderComponentAsync((rendererPayload) =>
      getOnlyHTMLFromRenderer(rendererPayload, true),
    ),
  )

export const renderAsyncFragments: <Props extends unknown>(
  componentName: string,
  componentShell: RiotComponentWrapper<Props>,
  props?: Props,
) => Promise<RenderingFragments> =
  // @ts-ignore
  curry(createRenderer)(
    renderComponentAsync((rendererPayload) =>
      getFragmentsFromRenderer(rendererPayload, true),
    ),
  )
export const fragments: <Props extends unknown>(
  componentName: string,
  componentShell: RiotComponentWrapper<Props>,
  props?: Props,
) => RenderingFragments =
  // @ts-ignore
  curry(createRenderer)(getFragmentsFromRenderer)

export const render: <Props extends unknown>(
  componentName: string,
  componentShell: RiotComponentWrapper<Props>,
  props?: Props,
) => string =
  // @ts-ignore
  curry(createRenderer)(getOnlyHTMLFromRenderer)

export default render

interface RenderingFragments {
  html: string
  css: string
}

interface domGlobals {
  create: () => void
  clear: () => void
}
