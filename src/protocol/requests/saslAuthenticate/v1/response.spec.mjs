import { describe, test, expect, it } from "@jest/globals";
import response from "./response.mjs";
import v1ResponsePlain from "../fixtures/v1_response_plain.json" with { type: "json" };
import v1ResponseScram256 from "../fixtures/v1_response_scram256.json" with { type: "json" };
import scram256FirstRequestResponseV1 from "../fixtures/scram256_firstRequest_response_v1.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > SaslAuthenticate > v1", () => {
  describe("PLAIN", () => {
    test("response", async () => {
      const data = await decode(Buffer.from(v1ResponsePlain));
      expect(data).toEqual({
        authBytes: Buffer.from({ data: [0, 0, 0, 0], type: "Buffer" }),
        errorCode: 0,
        errorMessage: null,
        sessionLifetimeMs: "360000",
      });

      await expect(parse(data)).resolves.toBeTruthy();
    });
  });

  describe("SCRAM", () => {
    test("response", async () => {
      const data = await decode(Buffer.from(v1ResponseScram256));
      expect(data).toEqual({
        authBytes: Buffer.from(scram256FirstRequestResponseV1),
        errorCode: 0,
        errorMessage: null,
        sessionLifetimeMs: "360000",
      });

      await expect(parse(data)).resolves.toBeTruthy();
    });
  });

  describe("parse", () => {
    const SASL_AUTHENTICATION_FAILED = 58;
    it("uses the custom message when errorCode SASL_AUTHENTICATION_FAILED", async () => {
      const data = { errorCode: SASL_AUTHENTICATION_FAILED, errorMessage: "Auth failed" };
      await expect(parse(data)).rejects.toThrow(/Auth failed/);
    });
  });
});
