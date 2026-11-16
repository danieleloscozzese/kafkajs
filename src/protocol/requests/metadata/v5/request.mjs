import requestV4 from "../v4/request.mjs";
/**
 * Metadata Request (Version: 5) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

const requestProtocol = ({ topics, allowAutoTopicCreation = true }) =>
  Object.assign(requestV4({ topics, allowAutoTopicCreation }), { apiVersion: 5 });

export default requestProtocol;
