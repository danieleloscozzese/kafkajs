import Encoder from "../../../encoder.mjs";

const requestProtocol = ({ finalMessage }) => ({
  encode: async () => new Encoder().writeBytes(finalMessage).buffer,
});

export default requestProtocol;
