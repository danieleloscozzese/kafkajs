import Encoder from "../../encoder.mjs";

const US_ASCII_NULL_CHAR = "\u0000";

const requestProtocol = ({
  authorizationIdentity,
  accessKeyId,
  secretAccessKey,
  sessionToken = "",
}) => ({
  encode: async () => {
    return new Encoder().writeBytes(
      [authorizationIdentity, accessKeyId, secretAccessKey, sessionToken].join(US_ASCII_NULL_CHAR),
    ).buffer;
  },
});

export default requestProtocol;
