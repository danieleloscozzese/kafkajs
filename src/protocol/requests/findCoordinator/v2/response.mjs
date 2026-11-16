import responseV1 from "../v1/response.mjs";
const { parse, decode: decodeV1 } = responseV1;

/**
 * Starting in version 2, on quota violation, brokers send out responses before throttling.
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-219+-+Improve+quota+communication
 *
 * FindCoordinator Response (Version: 1) => throttle_time_ms error_code error_message coordinator
 *   throttle_time_ms => INT32
 *   error_code => INT16
 *   error_message => NULLABLE_STRING
 *   coordinator => node_id host port
 *     node_id => INT32
 *     host => STRING
 *     port => INT32
 */

const decode = async (rawData) => {
  const decoded = await decodeV1(rawData);

  return {
    ...decoded,
    throttleTime: 0,
    clientSideThrottleTime: decoded.throttleTime,
  };
};

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
