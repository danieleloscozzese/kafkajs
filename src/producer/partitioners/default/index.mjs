import murmur2 from "./murmur2.mjs";
import createDefaultPartitioner from "../legacy/partitioner.mjs";

const indexProtocol = createDefaultPartitioner(murmur2);

export default indexProtocol;
