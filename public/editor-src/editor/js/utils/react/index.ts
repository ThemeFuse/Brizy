import type { MutableRefObject, Ref, RefObject, SyntheticEvent } from "react";

type WithValue = HTMLElement & { value: string };

export const inputValue = (e: SyntheticEvent<WithValue>): string =>
  (e.target as WithValue).value;

export function attachRef<T>(t: T | null, ref: Ref<T>): void {
  if (typeof ref === "function") {
    ref(t);
  } else if (ref && t) {
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    (ref as any).current = t;
  }
}

export function attachRefs<T>(
  t: T | null,
  refs: (RefObject<T> | MutableRefObject<T> | null)[]
): void {
  refs.forEach((ref) => {
    attachRef(t, ref);
  });
}
