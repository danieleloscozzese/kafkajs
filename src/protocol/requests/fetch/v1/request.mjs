import requestV0 from "../v0/request.mjs";
const requestProtocol = ({ replicaId, maxWaitTime, minBytes, topics }) => {
  return Object.assign(requestV0({ replicaId, maxWaitTime, minBytes, topics }), { apiVersion: 1 });
};

export default requestProtocol;
