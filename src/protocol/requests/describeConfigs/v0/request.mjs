import Encoder from "../../../encoder.mjs";
import apiKeys from "../../api_keys.mjs";
const { DescribeConfigs: apiKey } = apiKeys;

/**
 * DescribeConfigs Request (Version: 0) => [resources]
 *   resources => resource_type resource_name [config_names]
 *     resource_type => INT8
 *     resource_name => STRING
 *     config_names => STRING
 */

/**
 * @param {Array} resources An array of config resources to be returned
 */
const requestProtocol = ({ resources }) => ({
  apiKey,
  apiVersion: 0,
  apiName: "DescribeConfigs",
  encode: async () => {
    return new Encoder().writeArray(resources.map(encodeResource));
  },
});

const encodeResource = ({ type, name, configNames = [] }) => {
  return new Encoder().writeInt8(type).writeString(name).writeNullableArray(configNames);
};

export default requestProtocol;
