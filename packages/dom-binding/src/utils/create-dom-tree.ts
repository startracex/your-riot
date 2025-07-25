import { isSvg, isTemplate } from "@your-riot/utils/checks";

// in this case a simple innerHTML is enough
function createHTMLTree(html: string, root: any): DocumentFragment {
  const template = isTemplate(root) ? root : document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

// for svg nodes we need a bit more work
/* c8 ignore start */
function createSVGTree(html: any, container: SVGElement): HTMLElement {
  // create the SVGNode
  const svgNode = container.ownerDocument.importNode(
    new window.DOMParser().parseFromString(
      `<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`,
      "application/xml",
    ).documentElement,
    true,
  );

  return svgNode;
}
/* c8 ignore end */

/**
 * Create the DOM that will be injected.
 */
export default function createDOMTree(
  root: any,
  html: string,
): DocumentFragment | HTMLElement {
  /* c8 ignore next */
  if (isSvg(root)) {
    return createSVGTree(html, root);
  }

  return createHTMLTree(html, root);
}
