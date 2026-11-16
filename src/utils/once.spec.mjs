import { describe, it, expect, jest } from "@jest/globals";
import { createRequire } from "node:module";
import once from "./once.mjs";

const require = createRequire(import.meta.url);

describe("Utils > once", () => {
  it("should call the wrapped function only once", () => {
    const original = jest.fn().mockReturnValue("foo");
    const wrapped = once(original);

    expect(wrapped("hello")).toEqual("foo");
    expect(wrapped("hello")).toBeUndefined();

    expect(original).toHaveBeenCalledTimes(1);
    expect(original).toHaveBeenCalledWith("hello");
  });

  it("shares the implementation with the CommonJS compatibility path", () => {
    expect(require("./once.js")).toBe(once);
  });
});
