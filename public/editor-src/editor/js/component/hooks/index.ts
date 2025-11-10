import {
  type DependencyList,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { type MonoTypeOperatorFunction, Subject } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";
import type { TimerType } from "visual/types/TimerType";

const eq = <T>(a: T, b: T): boolean => a === b;

export function useDebouncedEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const ref = useRef<TimerType>();

  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = setTimeout(fn, ms) as unknown as TimerType;
    return (): void => clearTimeout(ref.current);
  }, [deps, fn, ms]);
}

const useLatest = <T>(value: T): RefObject<T> => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export function useThrottleEffect(
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): void {
  const fnRef = useLatest(fn);
  const timerRef = useRef<TimerType>();

  useEffect(() => {
    if (timerRef.current === undefined) {
      timerRef.current = setTimeout(() => {
        fnRef.current?.();
        timerRef.current = undefined;
      }, ms) as unknown as TimerType;
    }
  }, [deps, fnRef, timerRef, ms]);
}

const createTimedCallback =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timer: (t: number) => MonoTypeOperatorFunction<any>
  ) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends any[]>(
    callback: (...args: T) => void,
    timeout: number,
    deps?: DependencyList
  ): ((...args: T) => void) => {
    const subject = useMemo(() => {
      const subject = new Subject<T>();
      subject.pipe(timer(timeout)).subscribe((v) => callback(...v));

      return subject;
    }, [callback, timeout]);
    useEffect(
      () => () => {
        subject.complete();
      },
      [subject, deps]
    );

    return useCallback((...args: T) => subject.next(args), [subject]);
  };

export const createTimedOnchange = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timer: (t: number) => MonoTypeOperatorFunction<any>
): (<T>(
  value: T,
  onChange: (v: T) => void,
  timeout: number,
  compare?: (a: T, b: T) => boolean
) => [T, (v: T) => void]) => {
  const fn = createTimedCallback(timer);
  return <T>(
    value: T,
    onChange: (v: T) => void,
    timeout: number,
    compare: (a: T, b: T) => boolean = eq
  ): [T, (v: T) => void] => {
    const ref = useRef<T>(value);
    const [v, setV] = useState<T>(value);

    const _onChange = fn(onChange, timeout);

    useEffect(() => {
      if (!compare(v, ref.current)) {
        _onChange(v);
        ref.current = v;
      }
    }, [v, ref, _onChange, compare]);

    useEffect(() => {
      if (!compare(value, ref.current)) {
        setV(value);
        ref.current = value;
      }
    }, [value, ref, compare]);
    const setValue = useCallback(setV, [setV]);

    return [v, setValue];
  };
};

export const useDebouncedCallback = createTimedCallback(debounceTime);
export const useDebouncedOnChange = createTimedOnchange(debounceTime);

export const useThrottleCallback = createTimedCallback(throttleTime);
export const useThrottleOnChange = createTimedOnchange(throttleTime);
