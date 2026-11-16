import Decoder from "../../../decoder.mjs";
import protocolErrors from "../../../error.mjs";
import responseV0 from "../v0/response.mjs";
const { failIfVersionNotSupported } = protocolErrors;
const { parse: parseV0 } = responseV0;

/**
 * SyncGroup Response (Version: 1) => throttle_time_ms error_code member_assignment
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   member_assignment => BYTES
 */

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  const throttleTime = decoder.readInt32();
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    throttleTime,
    errorCode,
    memberAssignment: decoder.readBytes(),
  };
};

const responseProtocol = {
  decode,
  parse: parseV0,
};

export default responseProtocol;
