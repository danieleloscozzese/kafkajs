import Decoder from "../../../decoder.mjs";
import responseV0 from "../v0/response.mjs";
const { parse: parseV0 } = responseV0;

/**
 * v2 (supported in 0.10.0 or later)
 * ProduceResponse => [TopicName [Partition ErrorCode Offset Timestamp]] ThrottleTime
 *   TopicName => string
 *   Partition => int32
 *   ErrorCode => int16
 *   Offset => int64
 *   Timestamp => int64
 *   ThrottleTime => int32
 */

const partition = (decoder) => ({
  partition: decoder.readInt32(),
  errorCode: decoder.readInt16(),
  offset: decoder.readInt64().toString(),
  timestamp: decoder.readInt64().toString(),
});

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  const topics = decoder.readArray((decoder) => ({
    topicName: decoder.readString(),
    partitions: decoder.readArray(partition),
  }));

  const throttleTime = decoder.readInt32();

  return {
    topics,
    throttleTime,
  };
};

const responseProtocol = {
  decode,
  parse: parseV0,
};

export default responseProtocol;
