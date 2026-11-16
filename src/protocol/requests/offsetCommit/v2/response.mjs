import responseV0 from "../v0/response.mjs";
const { parse, decode } = responseV0;

/**
 * OffsetCommit Response (Version: 1) => [responses]
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition error_code
 *       partition => INT32
 *       error_code => INT16
 */

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
