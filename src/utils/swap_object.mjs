const { keys } = Object;
/**
 * @param {Object} object
 * @returns {Object}
 */
const swapObject = (object) =>
  keys(object).reduce((result, key) => ({ ...result, [object[key]]: key }), {});

export default swapObject;
