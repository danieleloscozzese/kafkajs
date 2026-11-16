/**
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
const uniq = (arr) => [...new Set(arr)];

export default uniq;
