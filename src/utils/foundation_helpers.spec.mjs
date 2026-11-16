import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import mapValues from "./map_values.mjs";
import seq from "./seq.mjs";
import uniq from "./uniq.mjs";

const require = createRequire(import.meta.url);

describe("Foundational helpers", () => {
  it("maps own values with their keys", () => {
    expect(mapValues({ a: 2, b: 3 }, (value, key) => `${key}:${value}`)).toEqual({
      a: "a:2",
      b: "b:3",
    });
  });

  it("generates sequences using the optional callback", () => {
    expect(seq(3)).toEqual([0, 1, 2]);
    expect(seq(2, (index) => index * 2)).toEqual([0, 2]);
    expect(() => seq(-1)).toThrow(RangeError);
  });

  it("deduplicates values in insertion order", () => {
    expect(uniq([NaN, 2, NaN, 1, 2])).toEqual([NaN, 2, 1]);
  });

  it("shares implementations with their CommonJS compatibility paths", () => {
    expect(require("./mapValues.js")).toBe(mapValues);
    expect(require("./seq.js")).toBe(seq);
    expect(require("./uniq.js")).toBe(uniq);
  });
});
