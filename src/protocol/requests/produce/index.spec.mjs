import { describe, test, expect } from "@jest/globals";
import indexModule from "./index.mjs";
const { versions, protocol } = indexModule;

describe("Protocol > Requests > Produce", () => {
  versions.forEach((version) => {
    describe(`v${version}`, () => {
      test("metadata about the API", () => {
        const { request } = protocol({ version })({});
        expect(request.expectResponse()).toEqual(true);
      });
    });
  });
});
