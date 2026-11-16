/**
 * @template T
 * @template {unknown[]} Args
 * @param { (...args: Args) => Promise<T> } asyncFunction
 * Promise returning function that will only ever be invoked sequentially.
 * @returns { (...args: Args) => Promise<T> }
 * Function that may invoke asyncFunction if there is not a currently executing invocation.
 * Returns promise from the currently executing invocation.
 */
const sharedPromiseTo = (asyncFunction) => {
  let promise = null;

  return (...args) => {
    if (promise == null) {
      promise = asyncFunction(...args).finally(() => (promise = null));
    }
    return promise;
  };
};

export default sharedPromiseTo;
