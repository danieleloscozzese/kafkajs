const decodeMessage = (decoder) => ({
  attributes: decoder.readInt8(),
  key: decoder.readBytes(),
  value: decoder.readBytes(),
});

export default decodeMessage;
