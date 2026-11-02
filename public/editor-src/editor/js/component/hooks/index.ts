import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type MonoTypeOperatorFunction, Subject } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";

const eq = <T>(a: T, b: T): boolean => a === b;

export {
  useDebouncedEffect,
  useThrottleEffect
} from "@brizy/builder-ui-components/src/hooks";

const createTimedCallback =
  (
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    timer: (t: number) => MonoTypeOperatorFunction<any>
  ) =>
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
  <T extends any[]>(
    callback: (...args: T) => void,
    timeout: number
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
      [subject]
    );

    return useCallback((...args: T) => subject.next(args), [subject]);
  };

export const createTimedOnchange = (
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
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
    }, [v, _onChange, compare]);

    useEffect(() => {
      if (!compare(value, ref.current)) {
        setV(value);
        ref.current = value;
      }
    }, [value, compare]);
    const setValue = useCallback(setV, []);

    return [v, setValue];
  };
};

export const useDebouncedCallback = createTimedCallback(debounceTime);
export const useDebouncedOnChange = createTimedOnchange(debounceTime);

export const useThrottleCallback = createTimedCallback(throttleTime);
export const useThrottleOnChange = createTimedOnchange(throttleTime);
