import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { createRequire } from "node:module";
import compression, {
  Types,
  Codecs,
  lookupCodec,
  lookupCodecByAttributes,
} from "./index.mjs";
import Gzip from "./gzip.mjs";
import Encoder from "../../encoder.mjs";
import Decoder from "../../decoder.mjs";
import { RecordBatch } from "../../recordBatch/v0/index.mjs";
import RecordBatchDecoder from "../../recordBatch/v0/decoder.mjs";
import Record from "../../recordBatch/record/v0/index.mjs";
import { KafkaJSNotImplemented } from "../../../errors.mjs";

const require = createRequire(import.meta.url);
const originalSnappy = Codecs[Types.Snappy];

afterEach(() => {
  Codecs[Types.Snappy] = originalSnappy;
});

describe("Compression", () => {
  it("shares mutable registries with CommonJS and the public entry", () => {
    expect(require("./index.js")).toBe(compression);
    expect(require("./gzip.js")).toBe(Gzip);
    expect(require("../../../../index.js").CompressionCodecs).toBe(Codecs);
    expect(require("../../../../index.js").CompressionTypes).toBe(Types);
    expect(lookupCodec(Types.GZIP)).toBe(Gzip);
  });

  it("round-trips gzip payloads and rejects corrupt input", async () => {
    const encoder = new Encoder().writeString("native compression");
    const encoded = await Gzip.compress(encoder);
    await expect(Gzip.decompress(encoded)).resolves.toEqual(encoder.buffer);
    await expect(Gzip.decompress(Buffer.from("invalid"))).rejects.toHaveProperty(
      "code",
      "Z_DATA_ERROR",
    );
  });

  it("preserves missing-codec errors and uncompressed lookup", () => {
    expect(lookupCodec(Types.None)).toBeNull();
    expect(lookupCodec(99)).toBeNull();
    for (const type of [Types.Snappy, Types.LZ4, Types.ZSTD]) {
      expect(() => lookupCodec(type)).toThrow(KafkaJSNotImplemented);
    }
  });

  it("uses registered codecs for record batch encoding and decoding", async () => {
    const codec = {
      compress: jest.fn(async ({ buffer }) => buffer),
      decompress: jest.fn(async (buffer) => buffer),
    };
    const factory = jest.fn(() => codec);
    require("./index.js").Codecs[Types.Snappy] = factory;
    expect(lookupCodecByAttributes(Types.Snappy | 0x10)).toBe(codec);

    const encoded = await RecordBatch({
      compression: Types.Snappy,
      firstTimestamp: 1000,
      maxTimestamp: 1000,
      records: [Record({ key: Buffer.from("k"), value: Buffer.from("v") })],
    });
    const decoded = await RecordBatchDecoder(new Decoder(encoded.buffer));

    expect(decoded.records).toHaveLength(1);
    expect(decoded.records[0]).toMatchObject({
      offset: "0",
      timestamp: "1000",
      key: Buffer.from("k"),
      value: Buffer.from("v"),
    });
    expect(codec.compress).toHaveBeenCalledTimes(1);
    expect(codec.decompress).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledTimes(3);
  });
});
