import { MValue } from "visual/utils/value";

type Props<T> = { props: { value: T } };

/**
 * Extract value prop from a react component like object
 */
export function getValue<T>(i: Props<T>): T {
  return i.props.value;
}

/**
 * Extract react component like object index with specific value
 */
export function getIndex<T>(v: T, items: Props<T>[]): MValue<number> {
  const index = items.map(getValue).indexOf(v);
  return index < 0 ? undefined : index;
}

/**
 * Returns previous value in a list to the provided one
 */
export function prevValue<T>(v: T, items: T[]): MValue<T> {
  if (items.length <= 1) {
    return items[0] ? items[0] : undefined;
  }

  const k = items.indexOf(v);

  if (k === -1) {
    return items[0];
  } else if (k === 0) {
    return items[items.length - 1];
  } else if (k >= items.length) {
    return items[items.length - 2];
  } else {
    return items[k - 1];
  }
}

/**
 * Returns next value in a list to the provided one
 */
export function nextValue<T>(v: T, items: T[]): MValue<T> {
  if (items.length <= 1) {
    return items[0] ? items[0] : undefined;
  }

  const k = items.indexOf(v);

  if (k === -1) {
    return items[0];
  } else if (k >= items.length - 1) {
    return items[0];
  } else {
    return items[k + 1];
  }
}

type ToPromise<T, S> = (v?: S) => Promise<T>;
type OrPromise<T, S> = T | ToPromise<T, S>;

/**
 * Apply a function over a value T or a function that returns a promise of T
 */
export function apply<T, S>(
  fn: (t: T) => void,
  t: OrPromise<T, S>,
  s?: S
): void {
  if (typeof t === "function") {
    (t as ToPromise<T, S>)(s).then(fn);
  } else {
    fn(t as T);
  }
}

export const arrowFn = (
  k: "ArrowDown" | "ArrowUp"
): typeof nextValue | typeof prevValue =>
  k === "ArrowDown" ? nextValue : prevValue;

/**
 * Calculate dropdown height based on current items container height,
 * number of items and number of items that needs to eb visible
 */
export const dropdownHeight = (
  scrollH: number,
  items: number,
  show: number
): number => (items <= show ? scrollH : (scrollH / items) * show);
