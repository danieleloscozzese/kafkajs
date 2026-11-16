import responseV0 from "../v0/response.mjs";
const { decode: decodeV0, parse: parseV0 } = responseV0;

const responseProtocol = {
  decode: decodeV0,
  parse: parseV0,
};

export default responseProtocol;
