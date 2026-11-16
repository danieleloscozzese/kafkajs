import crc32C from "./crc32_c.mjs";
const unsigned = (value) => Uint32Array.from([value])[0];

const checksum = (buffer) => unsigned(crc32C(buffer));

export default checksum;
