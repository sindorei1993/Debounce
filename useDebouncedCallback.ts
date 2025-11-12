import { debounce } from "./debounce-2";
import { useEffect, useMemo, useRef } from "react";

function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean; maxWait?: number },
  deps?: any[]
): T & { cancel: () => void; flush: () => void } {
  const fnRef = useRef(null);
  fnRef.current = fn;
  const debounceFn = useMemo(
    () => debounce(fnRef.current, wait, options),
    [wait, options, deps]
  );
  useEffect(() => {
    return () => {
      debounceFn.cancel();
    };
  }, [debounceFn]);
  return debounceFn;
}
