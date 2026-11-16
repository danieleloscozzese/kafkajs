import { describe, test, expect, it } from "@jest/globals";
import response from "./response.mjs";
import v0ResponsePlain from "../fixtures/v0_response_plain.json" with { type: "json" };
import v0ResponseScram256 from "../fixtures/v0_response_scram256.json" with { type: "json" };
import scram256FirstRequestResponse from "../fixtures/scram256_firstRequest_response.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > SaslAuthenticate > v0", () => {
  describe("PLAIN", () => {
    test("response", async () => {
      const data = await decode(Buffer.from(v0ResponsePlain));
      expect(data).toEqual({
        authBytes: Buffer.from({ data: [0, 0, 0, 0], type: "Buffer" }),
        errorCode: 0,
        errorMessage: null,
      });

      await expect(parse(data)).resolves.toBeTruthy();
    });
  });

  describe("SCRAM", () => {
    test("response", async () => {
      const data = await decode(Buffer.from(v0ResponseScram256));
      expect(data).toEqual({
        authBytes: Buffer.from(scram256FirstRequestResponse),
        errorCode: 0,
        errorMessage: null,
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
