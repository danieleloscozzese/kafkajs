import Decoder from "../../../decoder.mjs";
import protocolErrors from "../../../error.mjs";
const { failure, createErrorFromCode, failIfVersionNotSupported } = protocolErrors;

/**
 * SyncGroup Response (Version: 0) => error_code member_assignment
 *   error_code => INT16
 *   member_assignment => BYTES
 */

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    errorCode,
    memberAssignment: decoder.readBytes(),
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
