const { describe, expect, it } = require("@jest/globals");

const shuffle = require("./shuffle");

describe("Utils > shuffle", () => {
  it("shuffles", () => {
    const array = Array(500)
      .fill()
      .map((_, i) => i);
    const shuffled = shuffle(array);

    expect(shuffled).not.toEqual(array);
    for (let i = 0; i < array.length; i++) {
      expect(shuffled).toContain(array[i]);
    }
  });

  it("returns the same order for single element arrays", () => {
    expect(shuffle([1])).toEqual([1]);
  });

  it("throws if it receives a non-array", () => {
    expect(() => shuffle()).toThrow(TypeError);
    expect(() => shuffle("foo")).toThrow(TypeError);
    expect(() => shuffle({})).toThrow(TypeError);
  });
});
