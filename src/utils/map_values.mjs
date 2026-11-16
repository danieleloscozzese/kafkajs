const { entries } = Object;
/**
 * @template T, U
 * @param {Record<string, T>} obj
 * @param {(value: T, key: string) => U} mapper
 * @returns {Record<string, U>}
 */
const mapValues = (obj, mapper) =>
  entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: mapper(value, key),
    }),
    {},
  );

export default mapValues;
