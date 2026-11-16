import requestV1 from "../v1/request.mjs";
/**
 * FindCoordinator Request (Version: 2) => coordinator_key coordinator_type
 *   coordinator_key => STRING
 *   coordinator_type => INT8
 */

const requestProtocol = ({ coordinatorKey, coordinatorType }) =>
  Object.assign(requestV1({ coordinatorKey, coordinatorType }), { apiVersion: 2 });

export default requestProtocol;
