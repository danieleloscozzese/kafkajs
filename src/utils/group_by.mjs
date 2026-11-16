/**
 * @template T, K
 * @param {T[]} array
 * @param {(item: T) => K | PromiseLike<K>} groupFn
 * @returns {Promise<Map<Awaited<K>, T[]>>}
 */
const groupBy = async (array, groupFn) => {
  const result = new Map();

  for (const item of array) {
    const group = await Promise.resolve(groupFn(item));
    result.set(group, result.has(group) ? [...result.get(group), item] : [item]);
  }

  return result;
};

export default groupBy;
