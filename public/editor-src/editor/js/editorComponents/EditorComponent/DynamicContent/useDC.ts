import { useReducer, useEffect, useRef, useContext } from "react";
import { EditorComponentContext } from "../EditorComponentContext";
import { DCApiProxyInstance } from "./DCApiProxy";

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
  if (placeholder === undefined || placeholder === null || placeholder === "") {
    return { status: "empty" };
  }

  if (IS_PREVIEW) {
    return { status: "success", data: placeholder };
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchController = useRef<AbortController>();
  let delayTimeout: number;

  const {
    dynamicContent: { itemId }
  } = useContext(EditorComponentContext);
  const apiProxyConfig = { postId: itemId };

  useEffect(() => {
    if (state.status !== "initial") {
      dispatch({ type: "reset" });
    }

    return (): void => {
      fetchController.current?.abort();
      clearTimeout(delayTimeout);
    };
  }, [placeholder]);

  useEffect(() => {
    if (state.status !== "initial") {
      return;
    }

    // 1. delay or not
    if (delayMs > 0) {
      dispatch({ type: "wait_delay" });

      delayTimeout = window.setTimeout(() => {
        dispatch({ type: "wait_fetch" });
      }, delayMs);
    } else {
      dispatch({ type: "wait_fetch" });
    }

    // 2. fetch
    const cached = DCApiProxyInstance.getFromCache(placeholder, apiProxyConfig);

    if (cached !== undefined) {
      clearTimeout(delayTimeout);
      dispatch({ type: "fetch_success", data: cached });
    } else {
      const controller = new AbortController();
      const signal = controller.signal;

      fetchController.current = controller;

      DCApiProxyInstance.getDC([placeholder], apiProxyConfig)
        .then(r => {
          if (signal.aborted === false) {
            dispatch({ type: "fetch_success", data: r[0] });
          }
        })
        .catch(e => {
          if (signal.aborted === false) {
            dispatch({ type: "fetch_fail", error: e });
          }
        })
        .finally(() => {
          window.clearTimeout(delayTimeout);
        });
    }
  }, [state.status]);

  return state;
}
