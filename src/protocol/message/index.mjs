import V0 from "./v0/index.mjs";
import V1 from "./v1/index.mjs";

const versions = {
  0: V0,
  1: V1,
};

const MessageProtocol = ({ version = 0 }) => versions[version];

export default MessageProtocol;
