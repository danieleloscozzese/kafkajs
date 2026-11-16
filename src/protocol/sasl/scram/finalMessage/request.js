const Encoder = require("../../../encoder.mjs").default;

module.exports = ({ finalMessage }) => ({
  encode: async () => new Encoder().writeBytes(finalMessage).buffer,
});
