import {
  component,
  type RiotComponentWrapper,
  type RiotComponent,
  type RiotComponentFactoryFunction,
} from "@your-riot/riot";
import { defineProperty } from "@your-riot/utils/objects";

function moveChildren(source, target) {
  if (source.firstChild) {
    target.appendChild(source.firstChild);
    moveChildren(source, target);
  }
}

export function createElementClass(
  api: RiotComponentWrapper<RiotComponent>,
): typeof HTMLElement {
  const { css, exports, template } = api;
  const originalOnMounted = (exports as RiotComponent)?.onMounted;
  const tagImplementation = exports || {};

  return class extends HTMLElement {
    componentFactory?: RiotComponentFactoryFunction<RiotComponent>;
    component?: RiotComponent;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.componentFactory = component({
        exports: {
          ...tagImplementation,
          onMounted: undefined,
        } as RiotComponent,
        template,
      });

      if (css) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        this.shadowRoot?.adoptedStyleSheets.push();
      }
    }

    // on element appended callback
    connectedCallback() {
      this.component = this.componentFactory(this);

      // move the tag root html into the shadow DOM
      moveChildren(this.component.root, this.shadowRoot);

      // call the onmounted only when the DOM has been moved
      originalOnMounted?.apply(this.component, [
        this.component.props,
        this.component.state,
      ]);
    }

    // on attribute changed
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (!this.component) {
        return;
      }

      defineProperty(this.component, "props", {
        ...this.component.props,
        [attributeName]: newValue,
      });
      this.component.update();
    }

    // on element removed
    disconnectedCallback() {
      this.component.unmount();
    }

    // component properties to observe
    static get observedAttributes() {
      return (tagImplementation as any).observedAttributes || [];
    }
  };
}

export function define(
  name: string,
  api: RiotComponentWrapper<RiotComponent>,
  options?: ElementDefinitionOptions,
): void {
  if (!customElements.get(name)) {
    customElements.define(name, createElementClass(api), options);
  }
}

export default define;
