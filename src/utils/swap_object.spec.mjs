import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import swapObject from "./swap_object.mjs";

const require = createRequire(import.meta.url);

describe("Utils > swapObject", () => {
  it("swaps keys with values", () => {
    const obj = {
      a1: "a2",
      b1: "b2",
      c1: "c2",
    };

    expect(swapObject(obj)).toEqual({
      a2: "a1",
      b2: "b1",
      c2: "c1",
    });
  });

  it("shares the CommonJS compatibility path", () => {
    expect(require("./swapObject.js")).toBe(swapObject);
  });
});
