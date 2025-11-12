# DigiExpress, Debounce (Core JS → React Hook) — #09
## Part A — Implement `debounce`

**Goal:** Write a **pure JavaScript** `debounce(fn, wait, options?)` that delays invoking `fn` until `wait` ms since the last call.

**Signature**

```js
/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{leading?: boolean, trailing?: boolean, maxWait?: number}} [options]
 * @returns {Function & { cancel:()=>void, flush:()=>void }}
 */
function debounce(fn, wait, options) { /* your code */ }

```

**Requirements**

-   Defaults: `trailing=true`, `leading=false`.
    
-   If `leading=true`, call on the leading edge.
    
-   If `trailing=true`, call once after the quiet period with the **latest** args.
    
-   Preserve `this` and latest args.
    
-   Support `maxWait` (ensure at least one invoke within `maxWait` under constant calls).
    
-   Provide `.cancel()` and `.flush()` on the returned function.
    
-   Errors from `fn` should surface to the caller of the debounced wrapper.
    

**Edge cases to consider:** rapid bursts, `wait=0`, combinations of leading/trailing, cancellation.

Here’s the clean mental model for `debounce` options:

## `leading`

* **What it means:** Fire **immediately** on the first call in a burst.
* **How it feels:** “Respond right away, then pause.”
* **Timeline (wait=300ms):**

  ```
  calls:   |a     b     c|
  time →   0----100---200---300
  leading: FIRE(a)                (then suppress until quiet)
  ```
* After the leading fire, further calls within the wait window are **ignored** unless `trailing` is also on.

## `trailing` (default: true)

* **What it means:** Fire **after** the user stops calling for `wait` ms, using the **latest args**.
* **How it feels:** “Wait until the user stops, then act once.”
* **Timeline (wait=300ms):**

  ```
  calls:   |a     b     c|
  time →   0----100---200---500
  trailing:                FIRE(c)   (fires 300ms after the last call)
  ```

## `leading` + `trailing` together

* **What it means:** Fire **once at the start** and **once at the end** (if there was at least one call after the leading fire).
* **How it feels:** “Immediate feedback, plus a final consolidated update.”
* **Timeline (wait=300ms):**

  ```
  calls:   |a     b     c|
  time →   0----100---200---500
  leading: FIRE(a)
  trailing:                FIRE(c)   (last args win)
  ```

## `maxWait`

* **What it means:** Even if calls keep coming (never letting the wait window go quiet), **force an invoke at least every `maxWait` ms**.
* **Why it exists:** Pure trailing debounce can **starve** and never fire if input never stops.
* **Timeline (wait=300ms, maxWait=1000ms):**

  ```
  calls:   a b c d e f g h i j ... (continuous)
  time →   0--------300--------600--------900---1000
  effect:                                    FIRE(latest)   (forced by maxWait)
  ```
* After a `maxWait`-forced fire, the cycle restarts; if calls continue, another forced fire happens at the next `maxWait` boundary.

---

### Quick guidance

* **Search box**: `trailing: true` (default) — send request after typing stops.
* **Instant feedback (button press / first keystroke preview)**: `leading: true, trailing: true` — show something immediately, then finalize when idle.
* **High-traffic streams (scroll/resize telemetry)**: add `maxWait` to ensure periodic updates even if the stream never pauses.

----------

## Part B — Wrap in a React Hook

**Goal:** Create `useDebouncedCallback` that reuses your Part A function.

**Signature (TypeScript or JS w/ JSDoc ok)**

```ts
function useDebouncedCallback<T extends (...args:any[])=>any>(
  fn: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean; maxWait?: number },
  deps?: any[]
): T & { cancel: () => void; flush: () => void };

```

**Requirements**

-   Use your Part A `debounce` internally.
    
-   Avoid stale closures (always call the latest `fn`).
    
-   Stable identity unless `wait/options/deps` change.
    
-   Clean up timers on unmount (cancel pending).
    

----------

## Deliverables

-   `debounce.js` (or `.ts`)
    
-   `useDebouncedCallback.ts(x)` using your debounce
    
-   A brief README or inline comments explaining behavior and edge cases.
    
-   (Optional) minimal demo or quick tests showing default trailing, leading, `maxWait`, cancel, and flush.
    

**Evaluation focuses on:** correctness (incl. edge cases), API design, clarity, and React interop (memoization & cleanup).
