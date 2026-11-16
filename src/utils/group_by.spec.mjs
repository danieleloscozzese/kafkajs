import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import groupBy from "./group_by.mjs";

const require = createRequire(import.meta.url);

describe("Utils > groupBy", () => {
  it("group items by the function return", async () => {
    const input = [1, 2, 3, 4];
    const groupFn = (item) => (item % 2 === 0 ? "even" : "odd");
    const output = new Map([
      ["even", [2, 4]],
      ["odd", [1, 3]],
    ]);

    await expect(groupBy(input, groupFn)).resolves.toEqual(output);
  });

  it("works with async functions", async () => {
    const input = [1, 2, 3, 4];
    const groupFn = async (item) => (item % 2 === 0 ? "even" : "odd");
    const output = new Map([
      ["even", [2, 4]],
      ["odd", [1, 3]],
    ]);

    await expect(groupBy(input, groupFn)).resolves.toEqual(output);
  });

  it("works with objects as group keys", async () => {
    const even = {};
    const odd = {};

    const input = [1, 2, 3, 4];
    const groupFn = async (item) => (item % 2 === 0 ? even : odd);
    const output = new Map([
      [even, [2, 4]],
      [odd, [1, 3]],
    ]);

    await expect(groupBy(input, groupFn)).resolves.toEqual(output);
  });

  it("preserves group insertion order and propagates mapper errors", async () => {
    const groups = await groupBy([3, 2, 1], (item) => item % 2);
    expect([...groups.keys()]).toEqual([1, 0]);

    const error = new Error("mapper failed");
    await expect(
      groupBy([1], () => {
        throw error;
      }),
    ).rejects.toBe(error);
  });

  it("shares the implementation with the CommonJS compatibility path", () => {
    expect(require("./groupBy.js")).toBe(groupBy);
  });
});
