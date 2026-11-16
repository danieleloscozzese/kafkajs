import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { InitProducerId: apiKey } = apiKeys;

/**
 * InitProducerId Request (Version: 0) => transactional_id transaction_timeout_ms
 *   transactional_id => NULLABLE_STRING
 *   transaction_timeout_ms => INT32
 */

const requestProtocol = ({ transactionalId, transactionTimeout }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "InitProducerId",
  encode: async () => {
    return new Encoder().writeString(transactionalId).writeInt32(transactionTimeout);
  },
});

export default requestProtocol;
