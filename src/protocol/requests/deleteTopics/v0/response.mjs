import Decoder from "../../../decoder.mjs";
import protocolErrors from "../../../error.mjs";
const { failure, createErrorFromCode } = protocolErrors;

/**
 * DeleteTopics Response (Version: 0) => [topic_error_codes]
 *   topic_error_codes => topic error_code
 *     topic => STRING
 *     error_code => INT16
 */

const topicNameComparator = (a, b) => a.topic.localeCompare(b.topic);

const topicErrors = (decoder) => ({
  topic: decoder.readString(),
  errorCode: decoder.readInt16(),
});

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  return {
    topicErrors: decoder.readArray(topicErrors).sort(topicNameComparator),
  };
};

const parse = async (data) => {
  const topicsWithError = data.topicErrors.filter(({ errorCode }) => failure(errorCode));
  if (topicsWithError.length > 0) {
    throw createErrorFromCode(topicsWithError[0].errorCode);
  }

  return data;
};

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
