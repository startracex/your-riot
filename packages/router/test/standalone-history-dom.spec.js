import { fireEvent, sleep } from "./util.js";
import { initDomListeners } from "../dist/module/dom.js";
import route from "rawth";
import { setBase } from "../dist/module/set-base.js";
import $ from "bianco.query";
import { expect } from "chai";
import { spy } from "sinon";

describe("standalone history", () => {
  let teardown; // eslint-disable-line

  beforeEach(() => {
    setBase("/");

    document.body.innerHTML = `
    <nav>
      <a href="/hello">Hello</a>
      <a href="/user">User</a>
      <a href="/goodbye">goodbye</a>
      <a href="/user/gianluca">Username</a>
      <a href="/hello#anchor">Anchor</a>
    </nav>
  `;
    teardown = initDomListeners($("nav")[0]);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    window.history.replaceState(null, "", "/");
    teardown();
  });

  it("html5 history links dispatch events", async () => {
    const onRoute = spy();
    const hello = route("/hello").on.value(onRoute);

    const [a] = $("nav > a:first-of-type");

    fireEvent(a, "click");

    await sleep();

    expect(window.location.pathname).to.be.equal("/hello");
    expect(onRoute).to.have.been.called;

    hello.end();
  });

  it("html5 history links receive parameters", (done) => {
    const user = route("/user/:username").on.value((url) => {
      user.end();
      expect(url.params).to.be.deep.equal({ username: "gianluca" });
      done();
    });

    const [a] = $("nav > a:nth-child(4)");

    fireEvent(a, "click");
  });

  it("hash links are supported", async () => {
    const onRoute = spy();
    const hello = route("/hello(/?[?#].*)?").on.value(onRoute);

    const [a] = $("nav > a:nth-child(5)");

    fireEvent(a, "click");

    await sleep();

    expect(onRoute).to.have.been.called;
    expect(window.location.pathname).to.be.equal("/hello");
    expect(window.location.hash).to.be.equal("#anchor");

    hello.end();
  });
});
