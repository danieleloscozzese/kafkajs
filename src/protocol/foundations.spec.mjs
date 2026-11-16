import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import Encoder from "./encoder.mjs";
import Decoder from "./decoder.mjs";
import encodeRequest from "./request.mjs";
import crc32 from "./crc32.mjs";
import protocolErrors from "./error.mjs";
import { KafkaJSProtocolError } from "../errors.mjs";

const require = createRequire(import.meta.url);

describe("Protocol foundations", () => {
  it("shares constructors and helpers with CommonJS callers", () => {
    expect(require("./encoder.js")).toBe(Encoder);
    expect(require("./decoder.js")).toBe(Decoder);
    expect(require("./request.js")).toBe(encodeRequest);
    expect(require("./crc32.js")).toBe(crc32);
    expect(require("./error.js")).toBe(protocolErrors);
    expect(protocolErrors.createErrorFromCode(35)).toBeInstanceOf(KafkaJSProtocolError);
  });

  it("preserves request framing bytes", async () => {
    const encoded = await encodeRequest({
      correlationId: 7,
      clientId: "test",
      request: { apiKey: 3, apiVersion: 0, encode: async () => new Encoder().writeInt32(0) },
    });
    expect(encoded.buffer.toString("hex")).toBe(
      "00000012000300000000000700047465737400000000",
    );
  });

  it("preserves the CRC32 check vector", () => {
    expect(crc32({ buffer: Buffer.from("123456789") }) >>> 0).toBe(0xcbf43926);
  });

  it("preserves signed int64 boundaries without converting to numbers", () => {
    const encoded = new Encoder()
      .writeInt64("-9223372036854775808")
      .writeInt64("9223372036854775807");
    expect(encoded.buffer.toString("hex")).toBe("80000000000000007fffffffffffffff");
    const decoder = new Decoder(encoded.buffer);
    expect(decoder.readInt64()).toBe(-9223372036854775808n);
    expect(decoder.readInt64()).toBe(9223372036854775807n);
  });

  it("rejects truncated fixed-width fields", () => {
    expect(() => new Decoder(Buffer.from([1])).readInt32()).toThrow(
      expect.objectContaining({ name: "RangeError", code: "ERR_BUFFER_OUT_OF_BOUNDS" }),
    );
  });
});
