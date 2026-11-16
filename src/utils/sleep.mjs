/**
 * @param {number} timeInMs
 * @returns {Promise<void>}
 */
const sleep = (timeInMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });

export default sleep;
