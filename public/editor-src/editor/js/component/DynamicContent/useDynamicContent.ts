import { useState, useEffect } from "react";
import { getDynamicContent } from "visual/utils/api/editor/index.wp";
import {
  TGetDynamicContentResolve,
  TGetDynamicContentReject
} from "visual/utils/api/editor/types";

type TState =
  | {
      status: "waiting";
      data: null;
      error: null;
    }
  | {
      status: "resolved" | "rejected";
      data: TGetDynamicContentResolve;
      error: null;
    }
  | {
      status: "rejected";
      data: null;
      error: TGetDynamicContentReject;
    };

export function useDynamicContent(placeholder: string): TState {
  if (IS_PREVIEW) {
    return {
      status: "resolved",
      data: placeholder,
      error: null
    };
  }

  const [state, setState] = useState<TState>({
    status: "waiting",
    data: null,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getDynamicContent({
      placeholder,
      signal
    })
      .then((r: TGetDynamicContentResolve) => {
        if (signal.aborted === false) {
          setState({
            status: "resolved",
            data: r,
            error: null
          });
        }
      })
      .catch((e: TGetDynamicContentReject) => {
        if (signal.aborted === false) {
          setState({
            status: "rejected",
            data: null,
            error: e
          });
        }
      });

    return (): void => {
      controller.abort();
    };
  }, [placeholder]);

  return state;
}
