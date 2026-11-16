import Decoder from "../../../decoder.mjs";
import protocolErrors from "../../../error.mjs";
const { failure, createErrorFromCode, failIfVersionNotSupported } = protocolErrors;

/**
 * SaslHandshake Response (Version: 0) => error_code [enabled_mechanisms]
 *    error_code => INT16
 *    enabled_mechanisms => STRING
 */

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    errorCode,
    enabledMechanisms: decoder.readArray((decoder) => decoder.readString()),
  };
};

const parse = async (data) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
