// WARNING: This work is unfinished.
// My guess is that the waiting mechanism could be done more elegantly
// via Promise.race([fetchPromise, timeoutPromise]).
// Also we should see if the renderProps api should be replaced with something other

import React, { useEffect, useReducer, Reducer } from "react";

type TState<TResolve, TReject> =
  | {
      status: "delay" | "waiting";
    }
  | {
      status: "resolved";
      value: TResolve;
    }
  | {
      status: "rejected";
      reason: TReject;
    };
type TAction<TResolve, TReject> =
  | {
      type: "resolve";
      value: TResolve;
    }
  | {
      type: "reject";
      reason: TReject;
    }
  | {
      type: "wait";
    };

function reducer<TResolve, TReject>(
  state: TState<TResolve, TReject>,
  action: TAction<TResolve, TReject>
): TState<TResolve, TReject> {
  switch (action.type) {
    case "wait": {
      if (state.status === "delay") {
        return {
          status: "waiting"
        };
      }

      break;
    }
    case "resolve": {
      if (state.status === "delay" || state.status === "waiting") {
        return {
          status: "resolved",
          value: action.value
        };
      }

      break;
    }
    case "reject": {
      if (state.status === "delay" || state.status === "waiting") {
        return {
          status: "rejected",
          reason: action.reason
        };
      }

      break;
    }
  }

  return state;
}

type Props<TResolve, TReject> = {
  getPromise: () => Promise<TResolve>;
  renderResolved: (r: TResolve) => React.ReactElement;
  renderRejected?: (e: TReject) => React.ReactElement;
  renderWaiting?: () => React.ReactElement;
  delayMs?: number;
};

// TODO: see the warning at the beginning of the file
export function PromiseComponent<TResolve, TReject>({
  getPromise,
  renderResolved,
  renderRejected,
  renderWaiting,
  delayMs = 0
}: Props<TResolve, TReject>): React.ReactElement | null {
  const hasDelay = delayMs && delayMs > 0;
  const [state, dispatch] = useReducer<
    Reducer<TState<TResolve, TReject>, TAction<TResolve, TReject>>
  >(reducer, { status: hasDelay ? "delay" : "waiting" });

  useEffect(() => {
    let unmounted = false;
    let tid: number;

    if (hasDelay) {
      tid = window.setTimeout(() => {
        if (!unmounted) {
          dispatch({
            type: "wait"
          });
        }
      }, delayMs);
    }

    getPromise()
      .then(r => {
        if (!unmounted) {
          clearTimeout(tid);
          dispatch({
            type: "resolve",
            value: r
          });
        }
      })
      .catch(e => {
        if (!unmounted) {
          clearTimeout(tid);
          dispatch({
            type: "reject",
            reason: e
          });
        }
      });

    return (): void => {
      unmounted = true;
    };
  }, []);

  if (state.status === "waiting" && renderWaiting) {
    return renderWaiting();
  }

  if (state.status === "resolved") {
    return renderResolved(state.value);
  }

  if (state.status === "rejected" && renderRejected) {
    return renderRejected(state.reason);
  }

  return null;
}
