import { KafkaJSNotImplemented } from "../../../errors.mjs";
import Gzip from "./gzip.mjs";

const COMPRESSION_CODEC_MASK = 0x07;

const Types = {
  None: 0,
  GZIP: 1,
  Snappy: 2,
  LZ4: 3,
  ZSTD: 4,
};

const Codecs = {
  [Types.GZIP]: () => Gzip,
  [Types.Snappy]: () => {
    throw new KafkaJSNotImplemented("Snappy compression not implemented");
  },
  [Types.LZ4]: () => {
    throw new KafkaJSNotImplemented("LZ4 compression not implemented");
  },
  [Types.ZSTD]: () => {
    throw new KafkaJSNotImplemented("ZSTD compression not implemented");
  },
};

const lookupCodec = (type) => (Codecs[type] ? Codecs[type]() : null);
const lookupCodecByAttributes = (attributes) => {
  const codec = Codecs[attributes & COMPRESSION_CODEC_MASK];
  return codec ? codec() : null;
};

const compression = {
  Types,
  Codecs,
  lookupCodec,
  lookupCodecByAttributes,
  COMPRESSION_CODEC_MASK,
};

export default compression;
export { Types, Codecs, lookupCodec, lookupCodecByAttributes, COMPRESSION_CODEC_MASK };
