import ComponentWithLoadListener from "./components/component-with-load-listener.riot";
import ComponentWithSlotWrapper from "./components/component-with-slot-wrapper.riot";
import UserWrapper from "./components/user-wrapper.riot";
import UserWrapperWithoutLoader from "./components/user-wrapper-without-loader.riot";
import { component } from "@your-riot/riot";
import { expect } from "chai";
import lazy from "../dist/module/index.js";

const defer = () => Promise.resolve().then.bind(Promise.resolve());

describe("lazy", () => {
  it("it's ok being lazy", () => {
    // istn't that funny :D
    expect(lazy).to.be.ok;
  });

  it("Components with loader can be lazily loaded", async () => {
    const div = document.createElement("div");
    const el = component(UserWrapper)(div, {
      name: "Gianluca",
    });

    const loaderP = el.$("p");
    expect(loaderP.innerHTML).to.be.equal("Loading...");

    await defer();

    const userP = el.$("p");
    expect(userP.innerHTML).to.be.equal("Gianluca");

    el.unmount();
  });

  it("Components without loader can be lazily loaded", async () => {
    const div = document.createElement("div");
    const el = component(UserWrapperWithoutLoader)(div, {
      name: "Gianluca",
    });

    await defer();

    const p = el.$("p");
    expect(p.innerHTML).to.be.equal("Gianluca");

    el.unmount();
  });

  it("Components having slots can be lazily loaded", async () => {
    const div = document.createElement("div");
    const el = component(ComponentWithSlotWrapper)(div, {
      greeting: "Hello",
    });

    const loaderP = el.$("p");
    expect(loaderP.innerHTML).to.be.equal("Loading...");

    await defer();

    const p = el.$("p");
    expect(p.innerHTML).to.be.equal("Hello");

    el.unmount();
  });

  it("Lazy loaded component can dispatch load event", async () => {
    const div = document.createElement("div");
    const el = component(ComponentWithLoadListener)(div, {
      name: "Kal",
    });

    await defer();

    expect(el._loaded).to.be.equal(true);

    el.unmount();
  });
});
