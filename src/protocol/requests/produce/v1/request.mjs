import requestV0 from "../v0/request.mjs";
// Produce Request on or after v1 indicates the client can parse the quota throttle time
// in the Produce Response.

const requestProtocol = ({ acks, timeout, topicData }) => {
  return Object.assign(requestV0({ acks, timeout, topicData }), { apiVersion: 1 });
};

export default requestProtocol;
