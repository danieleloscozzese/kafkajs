import Decoder from "../../../decoder.mjs";
import protocolErrors from "../../../error.mjs";
const { failure, createErrorFromCode } = protocolErrors;

/**
 * ListGroups Response (Version: 0) => error_code [groups]
 *   error_code => INT16
 *   groups => group_id protocol_type
 *     group_id => STRING
 *     protocol_type => STRING
 */

const decodeGroup = (decoder) => ({
  groupId: decoder.readString(),
  protocolType: decoder.readString(),
});

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();
  const groups = decoder.readArray(decodeGroup);

  return {
    errorCode,
    groups,
  };
};

const parse = async (data) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

const responseProtocol = {
  decodeGroup,
  decode,
  parse,
};

export default responseProtocol;
