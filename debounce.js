/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{leading?: boolean, trailing?: boolean, maxWait?: number}} [options]
 * @returns {Function & { cancel:()=>void, flush:()=>void }}
 */
function debounce(fn, wait, options) {
  let timeoutId = null;
  let maxWaitTimeoutId = null;
  let isCalled = false;

  return (...args) => {
    if (options.leading && !isCalled) {
      fn(...args);
      isCalled = true;
      return;
    }
    if (options.maxWait) {
      maxWaitTimeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        fn(...args);
      }, options.maxWait);
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

const apiCall = (query) => {
  console.log(`API called with query: ${query}`);
};

const debouncedSearchFn = debounce(apiCall, 500, {
  leading: true,
  maxWait: 600,
});
debouncedSearchFn("1");
setTimeout(() => debouncedSearchFn("2"), 100);
setTimeout(() => debouncedSearchFn("3"), 200);
setTimeout(() => debouncedSearchFn("4"), 300);
setTimeout(() => debouncedSearchFn("5"), 1000);
setTimeout(() => debouncedSearchFn("6"), 3000);
module.exports = debounce;
