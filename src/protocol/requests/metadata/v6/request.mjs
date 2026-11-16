import requestV5 from "../v5/request.mjs";
/**
 * Metadata Request (Version: 6) => [topics] allow_auto_topic_creation
 *   topics => STRING
 *   allow_auto_topic_creation => BOOLEAN
 */

const requestProtocol = ({ topics, allowAutoTopicCreation = true }) =>
  Object.assign(requestV5({ topics, allowAutoTopicCreation }), { apiVersion: 6 });

export default requestProtocol;
