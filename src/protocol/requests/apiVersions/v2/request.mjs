import requestV0 from "../v0/request.mjs";
// ApiVersions Request after v1 indicates the client can parse throttle_time_ms

const requestProtocol = () => ({ ...requestV0(), apiVersion: 2 });

export default requestProtocol;
