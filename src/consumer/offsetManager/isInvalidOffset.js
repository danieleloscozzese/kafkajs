const Long = require("../../utils/long.mjs").default;

module.exports = (offset) => (!offset && offset !== 0) || Long.fromValue(offset).isNegative();
