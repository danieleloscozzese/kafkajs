import murmur2 from "./murmur2.mjs";
import createLegacyPartitioner from "./partitioner.mjs";

const indexProtocol = createLegacyPartitioner(murmur2);

export default indexProtocol;
