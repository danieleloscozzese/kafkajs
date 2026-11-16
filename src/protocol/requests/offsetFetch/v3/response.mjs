import Decoder from "../../../decoder.mjs";
import responseV2 from "../v2/response.mjs";
const { parse: parseV2 } = responseV2;

/**
 * OffsetFetch Response (Version: 3) => throttle_time_ms [responses] error_code
 *   throttle_time_ms => INT32
 *   responses => topic [partition_responses]
 *     topic => STRING
 *     partition_responses => partition offset metadata error_code
 *       partition => INT32
 *       offset => INT64
 *       metadata => NULLABLE_STRING
 *       error_code => INT16
 *   error_code => INT16
 */

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  return {
    throttleTime: decoder.readInt32(),
    responses: decoder.readArray(decodeResponses),
    errorCode: decoder.readInt16(),
  };
};

const decodeResponses = (decoder) => ({
  topic: decoder.readString(),
  partitions: decoder.readArray(decodePartitions),
});

const decodePartitions = (decoder) => ({
  partition: decoder.readInt32(),
  offset: decoder.readInt64().toString(),
  metadata: decoder.readString(),
  errorCode: decoder.readInt16(),
});

const responseProtocol = {
  decode,
  parse: parseV2,
};

export default responseProtocol;
