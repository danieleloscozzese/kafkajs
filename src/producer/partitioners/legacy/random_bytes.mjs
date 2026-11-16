import { createRequire } from "node:module";
import { KafkaJSNonRetriableError } from "../../../errors.mjs";

const require = createRequire(import.meta.url);
const toNodeCompatible = (crypto) => ({
  randomBytes: (size) => crypto.getRandomValues(Buffer.allocUnsafe(size)),
});

let cryptoImplementation = null;
if (global && global.crypto) {
  cryptoImplementation =
    global.crypto.randomBytes === undefined ? toNodeCompatible(global.crypto) : global.crypto;
} else if (global && global.msCrypto) {
  cryptoImplementation = toNodeCompatible(global.msCrypto);
} else if (global && !global.crypto) {
  cryptoImplementation = require("node:crypto");
}

const MAX_BYTES = 65536;

const randomBytes = (size) => {
  if (size > MAX_BYTES) {
    throw new KafkaJSNonRetriableError(
      `Byte length (${size}) exceeds the max number of bytes of entropy available (${MAX_BYTES})`,
    );
  }

  if (!cryptoImplementation) {
    throw new KafkaJSNonRetriableError("No available crypto implementation");
  }

  return cryptoImplementation.randomBytes(size);
};

export default randomBytes;
