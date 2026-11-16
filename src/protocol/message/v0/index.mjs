import Encoder from "../../encoder.mjs";
import crc32 from "../../crc32.mjs";
import { Types as Compression, COMPRESSION_CODEC_MASK } from "../compression/index.mjs";

/**
 * v0
 * Message => Crc MagicByte Attributes Key Value
 *   Crc => int32
 *   MagicByte => int8
 *   Attributes => int8
 *   Key => bytes
 *   Value => bytes
 */

const Message = ({ compression = Compression.None, key, value }) => {
  const content = new Encoder()
    .writeInt8(0) // magicByte
    .writeInt8(compression & COMPRESSION_CODEC_MASK)
    .writeBytes(key)
    .writeBytes(value);

  const crc = crc32(content);
  return new Encoder().writeInt32(crc).writeEncoder(content);
};

export default Message;
