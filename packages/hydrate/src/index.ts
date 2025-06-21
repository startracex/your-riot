import {
  component,
  type RiotComponent,
  type RiotComponentWrapper,
} from "@your-riot/riot";
import specialElHandlers from "morphdom/src/specialElHandlers.js";

/**
 * Create a DOM tree walker.
 */
function createWalker(node: HTMLElement): TreeWalker {
  return document.createTreeWalker(
    node,
    NodeFilter.SHOW_ELEMENT,
    { acceptNode: () => NodeFilter.FILTER_ACCEPT },
    // false,
  );
}

/**
 * Sync a source node with the one rendered in runtime.
 */
function sync(sourceNode: HTMLElement, targetNode: HTMLElement): void {
  const { activeElement } = document;
  const specialHandler = specialElHandlers[sourceNode.tagName];

  if (sourceNode === activeElement) {
    window.requestAnimationFrame(() => {
      targetNode.focus();
    });
  }

  if (specialHandler) {
    specialHandler(targetNode, sourceNode);
  }
}

/**
 * Morph the existing DOM node with the new created one.
 */
function morph(sourceElement: HTMLElement, targetElement: HTMLElement): void {
  const sourceWalker = createWalker(sourceElement);
  const targetWalker = createWalker(targetElement);
  // recursive function to walk source element tree
  const walk = (fn) =>
    sourceWalker.nextNode() && targetWalker.nextNode() && fn() && walk(fn);

  walk(() => {
    const currentNode = sourceWalker.currentNode as HTMLElement;
    const targetNode = targetWalker.currentNode as HTMLElement;

    if (currentNode.tagName === targetNode.tagName) {
      sync(currentNode, targetNode);
    }

    return true;
  });
}

/**
 * Create a custom Riot.js mounting function to hydrate an existing SSR DOM node.
 */
export default function hydrate(
  componentAPI: RiotComponentWrapper<RiotComponent>,
): (element: HTMLElement, props: any) => RiotComponent {
  const mountComponent = component(componentAPI);

  return (element, props) => {
    const clone = element.cloneNode(false) as HTMLElement;
    const instance = mountComponent(clone, props) as RiotComponent & {
      onBeforeHydrate?: Function;
      onHydrated?: Function;
    };

    if (instance.onBeforeHydrate) {
      instance.onBeforeHydrate(instance.props, instance.state);
    }

    // morph the nodes
    morph(element, clone);

    // swap the html
    element.parentNode.replaceChild(clone, element);

    if (instance.onHydrated) {
      instance.onHydrated(instance.props, instance.state);
    }

    return instance;
  };
}
