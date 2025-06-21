import {
  evaluateAttributeExpressions,
  memoize,
  panic,
} from "../dist/module/misc.js";
import expressionTypes from "../dist/module/expression-types.js";
import { expect } from "chai";

const { ATTRIBUTE, REF } = expressionTypes;
describe("Misc", () => {
  it("panic", () => {
    expect(() => panic("err")).to.throw();
  });

  it("evaluateAttributeExpressions", () => {
    expect(
      evaluateAttributeExpressions([
        {
          name: "class",
          type: ATTRIBUTE,
          value: "hello",
        },
      ]),
    ).to.be.deep.equal({
      class: "hello",
    });
  });

  it("evaluateAttributeExpressions (skip ref attributes)", () => {
    expect(
      evaluateAttributeExpressions([
        {
          type: REF,
        },
      ]),
    ).to.be.deep.equal({});
  });

  it("memoize", () => {
    let count = 0; // eslint-disable-line
    const increment = memoize(() => {
      count++;

      return count;
    });

    increment(1);
    increment(1);

    expect(count).to.be.equal(1);
  });
});
