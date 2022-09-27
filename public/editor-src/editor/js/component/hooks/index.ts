import { DependencyList, useEffect, useMemo, useRef, useState } from "react";
import { MonoTypeOperatorFunction, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
  throttleTime,
  withLatestFrom
} from "rxjs/operators";

const eq = <T>(a: T, b: T): boolean => a === b;

export function useDebouncedEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const ref = useRef<number>();

  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = setTimeout(fn, ms);
    return (): void => clearTimeout(ref.current);
  }, [deps, fn, ms]);
}

export function useThrottleEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const { current } = useRef<{ t?: number; f: VoidFunction }>({ f: fn });

  useEffect(() => {
    current.f = fn;

    if (current.t === undefined) {
      current.t = setTimeout(() => {
        current.f();
        current.t = undefined;
      }, ms);
    }
  }, [deps, current, fn, ms]);
}

export const createTimedOnchange =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timer: (t: number) => MonoTypeOperatorFunction<any>
  ) =>
  <T>(
    value: T,
    onChange: (v: T) => void,
    timeout: number,
    compare: (a: T, b: T) => boolean = eq
  ): [T, (v: T) => void] => {
    const compareRef = useRef({ fn: compare });
    compareRef.current.fn = compare;

    const timeoutRef = useRef(timeout);
    timeoutRef.current = timeout;

    const changeRef = useRef({ fn: onChange });
    changeRef.current.fn = onChange;

    const [v, setV] = useState<T>(value);

    const value$ = useMemo(() => new Subject<T>(), []);
    const lastValue$ = useMemo(() => new Subject<T>(), []);
    const newValue$ = useMemo(() => new Subject<T>(), []);

    useEffect(() => {
      value$.next(value);
    }, [value]);

    useEffect(() => {
      const a$ = value$
        .pipe(
          withLatestFrom(lastValue$),
          filter(([a, b]) => !compareRef.current.fn(a, b)),
          map(([a]) => a)
        )
        .subscribe(newValue$);
      const b$ = newValue$
        .pipe(
          distinctUntilChanged((a, b) => compareRef.current.fn(a,b)),
          tap<T>(setV),
          timer(timeoutRef.current)
        )
        .subscribe(lastValue$);
      const c$ = lastValue$
        .pipe(distinctUntilChanged((a, b) => compareRef.current.fn(a,b)))
        .subscribe((v) => changeRef.current.fn(v));

      return (): void => {
        a$.unsubscribe();
        b$.unsubscribe();
        c$.unsubscribe();
      };
    }, []);

    return [v, newValue$.next.bind(newValue$)];
  };

export const useDebouncedOnChange = createTimedOnchange(debounceTime);
export const useThrottleOnChange = createTimedOnchange((t: number) =>
  throttleTime(t, undefined, { leading: false, trailing: true })
);
