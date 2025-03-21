import { useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { useConfig } from "visual/providers/ConfigProvider";
import { isView, useRender } from "visual/providers/RenderProvider";
import { EditorComponentContext } from "../EditorComponentContext";
import { DCApiProxyInstance } from "./DCApiProxyInstance";

export type State =
  | {
      status: "empty" | "initial" | "waiting_delay" | "waiting_fetch";
    }
  | {
      status: "success";
      data: string;
    }
  | {
      status: "failed";
      error: unknown;
    };
type Action =
  | { type: "wait_delay" }
  | { type: "wait_fetch" }
  | { type: "fetch_success"; data: string }
  | { type: "fetch_fail"; error: unknown }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (state.status) {
    case "initial":
      switch (action.type) {
        case "wait_delay":
          return { status: "waiting_delay" };
        case "wait_fetch":
          return { status: "waiting_fetch" };
      }
      break;
    case "waiting_delay":
      switch (action.type) {
        case "wait_fetch":
          return { status: "waiting_fetch" };
        case "fetch_success":
          return { status: "success", data: action.data };
        case "fetch_fail":
          return { status: "failed", error: action.error };
        case "reset":
          return { status: "initial" };
      }
      break;
    case "waiting_fetch":
      switch (action.type) {
        case "fetch_success":
          return { status: "success", data: action.data };
        case "fetch_fail":
          return { status: "failed", error: action.error };
        case "reset":
          return { status: "initial" };
      }
      break;
    case "success":
    case "failed":
      switch (action.type) {
        case "reset":
          return { status: "initial" };
      }
      break;
  }

  return state;
}

const initialState: State = { status: "initial" };

export function useDC(
  placeholder: string | undefined | null,
  delayMs = 0
): State {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { renderType } = useRender();
  const IS_VIEW = isView(renderType);
  const config = useConfig();

  const fetchController = useRef<AbortController>();
  const delayTimeout = useRef<number>();

  const {
    dynamicContent: { itemId }
  } = useContext(EditorComponentContext);

  const { status: currentState } = state;

  const isInitial = useMemo(() => currentState !== "initial", [currentState]);

  useEffect(() => {
    if (
      placeholder === undefined ||
      placeholder === null ||
      placeholder === "" ||
      IS_VIEW
    ) {
      return;
    }

    if (isInitial) {
      dispatch({ type: "reset" });
    }

    return (): void => {
      fetchController.current?.abort();
      clearTimeout(delayTimeout.current);
    };

    // isInitial dependency is not nedded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, IS_VIEW]);

  useEffect(() => {
    if (
      placeholder === undefined ||
      placeholder === null ||
      placeholder === "" ||
      IS_VIEW ||
      isInitial
    ) {
      return;
    }

    // 1. delay or not
    if (delayMs > 0) {
      dispatch({ type: "wait_delay" });

      delayTimeout.current = window.setTimeout(() => {
        dispatch({ type: "wait_fetch" });
      }, delayMs);
    } else {
      dispatch({ type: "wait_fetch" });
    }

    const apiProxyConfig = { postId: itemId, globalConfig: config };

    // 2. fetch
    const cached = DCApiProxyInstance.getFromCache(placeholder, apiProxyConfig);

    if (cached !== undefined) {
      clearTimeout(delayTimeout.current);
      dispatch({ type: "fetch_success", data: cached });
    } else {
      const controller = new AbortController();
      const signal = controller.signal;

      fetchController.current = controller;

      DCApiProxyInstance.getDC([placeholder], apiProxyConfig)
        .then((r) => {
          if (signal.aborted === false) {
            dispatch({ type: "fetch_success", data: r[0] });
          }
        })
        .catch((e) => {
          if (signal.aborted === false) {
            dispatch({ type: "fetch_fail", error: e });
          }
        })
        .finally(() => {
          window.clearTimeout(delayTimeout.current);
        });
    }
  }, [delayMs, placeholder, itemId, isInitial, IS_VIEW, config]);

  if (placeholder === undefined || placeholder === null || placeholder === "") {
    return { status: "empty" };
  }

  if (IS_VIEW) {
    return { status: "success", data: placeholder };
  }

  return state;
}
