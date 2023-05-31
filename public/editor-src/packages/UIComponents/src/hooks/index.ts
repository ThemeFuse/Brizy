import { DependencyList, useEffect, useRef } from "react";

export function useDebouncedEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const ref = useRef<NodeJS.Timeout | number>();

  useEffect(() => {
    clearTimeout(Number(ref.current));
    ref.current = setTimeout(fn, ms);
    return (): void => clearTimeout(Number(ref.current));
  }, [deps, fn, ms]);
}
