import Decoder from "../../../decoder.mjs";
import responseV1 from "../v1/response.mjs";
const { parse: parseV1 } = responseV1;

/**
 * CreateTopics Response (Version: 2) => throttle_time_ms [topic_errors]
 *   throttle_time_ms => INT32
 *   topic_errors => topic error_code error_message
 *     topic => STRING
 *     error_code => INT16
 *     error_message => NULLABLE_STRING
 */

const topicNameComparator = (a, b) => a.topic.localeCompare(b.topic);

const topicErrors = (decoder) => ({
  topic: decoder.readString(),
  errorCode: decoder.readInt16(),
  errorMessage: decoder.readString(),
});

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  return {
    throttleTime: decoder.readInt32(),
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  };
};

const responseProtocol = {
  decode,
  parse: parseV1,
};

export default responseProtocol;
