import Decoder from "../../../decoder.mjs";
import responseV0 from "../v0/response.mjs";
const { parse: parseV0 } = responseV0;

/**
 * CreateTopics Response (Version: 1) => [topic_errors]
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
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  };
};

const responseProtocol = {
  decode,
  parse: parseV0,
};

export default responseProtocol;
