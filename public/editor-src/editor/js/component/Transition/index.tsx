import { JSX, useEffect, useMemo, useState } from "react";
import { TransitionPhase, TransitionProps, TransitionState } from "./types";
import { EVENT_MAP } from "./utils";

export const Transition = (props: TransitionProps): JSX.Element | null => {
  const {
    children,
    in: inProp = false,
    appear = false,
    enter = true,
    exit = true,
    duration = 500,
    alwaysMounted = false,
    addEndListener
  } = props;

  let ignoreInPropChange = false;

  const [phase, setPhase] = useState(() => {
    ignoreInPropChange = true;
    if (!inProp) {
      return TransitionPhase.EXIT_DONE;
    }
    if (appear) {
      return TransitionPhase.APPEAR;
    }
    return TransitionPhase.APPEAR_DONE;
  });

  const [eventName, nextPhase, delay] = EVENT_MAP[phase];

  const { [eventName]: event } = props;

  useEffect(() => {
    const { setTimeout, clearTimeout } = window;

    event?.();

    let tm = 0;

    if (nextPhase) {
      if (delay) {
        if (addEndListener) {
          addEndListener(phase, () => setPhase(nextPhase));
        } else {
          tm = setTimeout(setPhase, duration, nextPhase);
        }
      } else {
        tm = setTimeout(setPhase, 0, nextPhase);
      }
    }
    return () => {
      clearTimeout(tm);
    };
  }, [phase, duration, event, nextPhase, delay, addEndListener]);

  useEffect(() => {
    if (!ignoreInPropChange) {
      if (inProp) {
        setPhase(enter ? TransitionPhase.ENTER : TransitionPhase.ENTER_DONE);
      } else {
        setPhase(exit ? TransitionPhase.EXIT : TransitionPhase.EXIT_DONE);
      }
    }
  }, [inProp, enter, exit, ignoreInPropChange]);

  const transitionState = useMemo(
    () =>
      Object.keys(EVENT_MAP).reduce(
        (acc, phaseI) => ({ ...acc, [phaseI]: phase === phaseI }),
        {} as TransitionState
      ),
    [phase]
  );

  if (
    !alwaysMounted &&
    (exit ? phase === TransitionPhase.EXIT_DONE : !inProp)
  ) {
    return null;
  }

  return typeof children === "function"
    ? children(transitionState, phase)
    : children;
};
