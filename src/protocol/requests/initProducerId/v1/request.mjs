import requestV0 from "../v0/request.mjs";
/**
 * InitProducerId Request (Version: 1) => transactional_id transaction_timeout_ms
 *   transactional_id => NULLABLE_STRING
 *   transaction_timeout_ms => INT32
 */

const requestProtocol = ({ transactionalId, transactionTimeout }) =>
  Object.assign(requestV0({ transactionalId, transactionTimeout }), { apiVersion: 1 });

export default requestProtocol;
