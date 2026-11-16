const HeaderDecoder = (decoder) => ({
  key: decoder.readVarIntString(),
  value: decoder.readVarIntBytes(),
});

export default HeaderDecoder;
