const once = (fn) => {
  let called = false;

  return (...args) => {
    if (!called) {
      called = true;
      return fn(...args);
    }
  };
};

export default once;
