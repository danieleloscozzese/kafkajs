import { promisify } from "node:util";
import zlib from "node:zlib";

const gzip = promisify(zlib.gzip);
const unzip = promisify(zlib.unzip);

const Gzip = {
  /**
   * @param {{ buffer: Buffer }} encoder
   * @returns {Promise<Buffer>}
   */
  async compress(encoder) {
    return await gzip(encoder.buffer);
  },

  /**
   * @param {Buffer} buffer
   * @returns {Promise}
   */
  async decompress(buffer) {
    return await unzip(buffer);
  },
};

export default Gzip;
