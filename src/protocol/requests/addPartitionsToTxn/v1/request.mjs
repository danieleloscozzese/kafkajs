import requestV0 from "../v0/request.mjs";
/**
 * AddPartitionsToTxn Request (Version: 1) => transactional_id producer_id producer_epoch [topics]
 *   transactional_id => STRING
 *   producer_id => INT64
 *   producer_epoch => INT16
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => INT32
 */

const requestProtocol = ({ transactionalId, producerId, producerEpoch, topics }) =>
  Object.assign(
    requestV0({
      transactionalId,
      producerId,
      producerEpoch,
      topics,
    }),
    { apiVersion: 1 },
  );

export default requestProtocol;
