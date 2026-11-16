import Decoder from "../../../decoder.mjs";
import protocolErrors from "../../../error.mjs";
const { failure, createErrorFromCode, failIfVersionNotSupported } = protocolErrors;

/**
 * ApiVersionResponse => ApiVersions
 *   ErrorCode = INT16
 *   ApiVersions = [ApiVersion]
 *     ApiVersion = ApiKey MinVersion MaxVersion
 *       ApiKey = INT16
 *       MinVersion = INT16
 *       MaxVersion = INT16
 */

const apiVersion = (decoder) => ({
  apiKey: decoder.readInt16(),
  minVersion: decoder.readInt16(),
  maxVersion: decoder.readInt16(),
});

const decode = async (rawData) => {
  const decoder = new Decoder(rawData);
  const errorCode = decoder.readInt16();

  failIfVersionNotSupported(errorCode);

  return {
    errorCode,
    apiVersions: decoder.readArray(apiVersion),
  };
};

const parse = async (data) => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode);
  }

  return data;
};

const responseProtocol = {
  decode,
  parse,
};

export default responseProtocol;
