import DefaultPartitioner from "./default/index.mjs";
import LegacyPartitioner from "./legacy/index.mjs";

const indexProtocol = {
  DefaultPartitioner,
  LegacyPartitioner,
  /**
   * @deprecated Use DefaultPartitioner instead
   *
   * The JavaCompatiblePartitioner was renamed DefaultPartitioner
   * and made to be the default in 2.0.0.
   */
  JavaCompatiblePartitioner: DefaultPartitioner,
};

export default indexProtocol;
