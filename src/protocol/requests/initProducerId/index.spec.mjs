import { describe, test, expect } from "@jest/globals";
import Decoder from "../../decoder.mjs";
import initProducerId from "./index.mjs";

describe("Protocol > Requests > InitProducerId", () => {
  initProducerId.versions.forEach((version) => {
    describe(`version v${version}`, () => {
      test.each([
        [undefined, 5000],
        [0, 0],
        [10000, 10000],
      ])("encodes transaction timeout %s as %s", async (transactionTimeout, expected) => {
        const { request } = initProducerId.protocol({ version })({
          transactionalId: "foo",
          transactionTimeout,
        });
        const { buffer } = await request.encode();
        const decoder = new Decoder(buffer);
        expect(decoder.readString()).toBe("foo");
        expect(decoder.readInt32()).toBe(expected);
        expect(decoder.canReadBytes(1)).toBe(false);
      });
    });
  });
});
