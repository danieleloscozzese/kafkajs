import {
  KafkaJSPartialMessageError,
  KafkaJSUnsupportedMagicByteInMessageSet,
} from "../../errors.mjs";

import V0Decoder from "./v0/decoder.mjs";
import V1Decoder from "./v1/decoder.mjs";

const decodeMessage = (decoder, magicByte) => {
  switch (magicByte) {
    case 0:
      return V0Decoder(decoder);
    case 1:
      return V1Decoder(decoder);
    default:
      throw new KafkaJSUnsupportedMagicByteInMessageSet(
        `Unsupported MessageSet message version, magic byte: ${magicByte}`,
      );
  }
};

const MessageDecoder = (offset, size, decoder) => {
  // Don't decrement decoder.offset because slice is already considering the current
  // offset of the decoder
  const remainingBytes = Buffer.byteLength(decoder.slice(size).buffer);

  if (remainingBytes < size) {
    throw new KafkaJSPartialMessageError(
      `Tried to decode a partial message: remainingBytes(${remainingBytes}) < messageSize(${size})`,
    );
  }

  const crc = decoder.readInt32();
  const magicByte = decoder.readInt8();
  const message = decodeMessage(decoder, magicByte);
  return Object.assign({ offset, size, crc, magicByte }, message);
};

export default MessageDecoder;
