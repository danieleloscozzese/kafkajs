import Encoder from "../../../encoder.mjs";

/**
 * v0
 * Header => Key Value
 *   Key => varInt|string
 *   Value => varInt|bytes
 */

const Header = ({ key, value }) => {
  return new Encoder().writeVarIntString(key).writeVarIntBytes(value);
};

export default Header;
