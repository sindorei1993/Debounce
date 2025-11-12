// ...existing code...
/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{leading?: boolean, trailing?: boolean, maxWait?: number}} [options]
 * @returns {Function & { cancel:()=>void, flush:()=>any }}
 */
export function debounce(fn, wait = 0, options = {}) {
  let timerId = null;
  let maxTimerId = null;
  let lastArgs = null;
  let lastThis = null;
  let result;
  const leading = !!options.leading;
  const trailing = options.trailing !== false; // default true
  const maxWait =
    typeof options.maxWait === "number"
      ? Math.max(options.maxWait, wait)
      : null;

  function invoke() {
    const res = fn.apply(lastThis, lastArgs);
    result = res;
    lastArgs = lastThis = null;
    clearTimeout(timerId);
    timerId = null;
    if (maxTimerId) {
      clearTimeout(maxTimerId);
      maxTimerId = null;
    }
    return res;
  }

  function onTimerExpired() {
    timerId = null;
    if (trailing && lastArgs) {
      invoke();
    }
    // ensure max timer cleared
    if (maxTimerId) {
      clearTimeout(maxTimerId);
      maxTimerId = null;
    }
  }

  function scheduleMaxTimer() {
    if (maxWait == null || maxTimerId) return;
    maxTimerId = setTimeout(() => {
      maxTimerId = null;
      // force invoke now (clear normal timer so trailing won't double-call)
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      if (lastArgs) {
        invoke();
      }
    }, maxWait);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const shouldCallNow = leading && !timerId;

    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    // schedule regular trailing timer
    timerId = setTimeout(onTimerExpired, wait);

    // schedule maxWait timer (from first call in burst)
    scheduleMaxTimer();

    if (shouldCallNow) {
      // call immediately for leading
      invoke();
    }

    return result;
  }

  debounced.cancel = function () {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    if (maxTimerId) {
      clearTimeout(maxTimerId);
      maxTimerId = null;
    }
    lastArgs = lastThis = null;
    result = undefined;
  };

  debounced.flush = function () {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
      return invoke();
    }
    return result;
  };

  return debounced;
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
// ...existing code...
