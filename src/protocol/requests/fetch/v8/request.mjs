import ISOLATION_LEVEL from "../../../isolation_level.mjs";
import requestV7 from "../v7/request.mjs";
/**
 * Quota violation brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 */

/**
 * Fetch Request (Version: 8) => replica_id max_wait_time min_bytes max_bytes isolation_level session_id session_epoch [topics] [forgotten_topics_data]
 *   replica_id => INT32
 *   max_wait_time => INT32
 *   min_bytes => INT32
 *   max_bytes => INT32
 *   isolation_level => INT8
 *   session_id => INT32
 *   session_epoch => INT32
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition fetch_offset log_start_offset partition_max_bytes
 *       partition => INT32
 *       fetch_offset => INT64
 *       log_start_offset => INT64
 *       partition_max_bytes => INT32
 *   forgotten_topics_data => topic [partitions]
 *     topic => STRING
 *     partitions => INT32
 */

const requestProtocol = ({
  replicaId,
  maxWaitTime,
  minBytes,
  maxBytes,
  topics,
  isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
  sessionId = 0,
  sessionEpoch = -1,
  forgottenTopics = [], // Topics to remove from the fetch session
}) =>
  Object.assign(
    requestV7({
      replicaId,
      maxWaitTime,
      minBytes,
      maxBytes,
      topics,
      isolationLevel,
      sessionId,
      sessionEpoch,
      forgottenTopics,
    }),
    { apiVersion: 8 },
  );

export default requestProtocol;
