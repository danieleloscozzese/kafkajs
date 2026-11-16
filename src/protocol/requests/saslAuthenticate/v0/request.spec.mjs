import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import plainBytes from "../fixtures/plain_bytes.json" with { type: "json" };
import v0RequestPlain from "../fixtures/v0_request_plain.json" with { type: "json" };
import scram256Bytes from "../fixtures/scram256_bytes.json" with { type: "json" };
import v0RequestScram256 from "../fixtures/v0_request_scram256.json" with { type: "json" };
describe("Protocol > Requests > SaslAuthenticate > v0", () => {
  describe("request", () => {
    describe("PLAIN", () => {
      test("encode", async () => {
        const { buffer } = await RequestV0Protocol({
          authBytes: Buffer.from(plainBytes),
        }).encode();

        expect(buffer).toEqual(Buffer.from(v0RequestPlain));
      });
    });

    describe("SCRAM", () => {
      test("encode", async () => {
        const { buffer } = await RequestV0Protocol({
          authBytes: Buffer.from(scram256Bytes),
        }).encode();

        expect(buffer).toEqual(Buffer.from(v0RequestScram256));
      });
    });
  });
});
