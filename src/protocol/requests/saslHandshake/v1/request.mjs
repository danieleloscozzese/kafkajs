import requestV0 from "../v0/request.mjs";
const requestProtocol = ({ mechanism }) => ({ ...requestV0({ mechanism }), apiVersion: 1 });

export default requestProtocol;
