import { DependencyList, useEffect, useRef } from "react";

export function debouncedEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const ref = useRef<number>();

  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = setTimeout(fn, ms);
    return (): void => clearTimeout(ref.current);
  }, deps);
}

export function throttleEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const { current } = useRef<{ t?: number; f: Function }>({ f: fn });

  useEffect(() => {
    current.f = fn;

    if (current.t === undefined) {
      current.t = setTimeout(() => {
        current.f();
        current.t = undefined;
      }, ms);
    }
  }, deps);
}
