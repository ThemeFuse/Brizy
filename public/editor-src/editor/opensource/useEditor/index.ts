import { RefCallback, useEffect, useReducer, useRef } from "react";
import { EditorConfig } from "../models/Config";
import { useLoadEditor } from "../useLoadEditor";
import { reducer } from "./reducer";
import { ActionKind, BuilderGlobal, Instance, State } from "./types";

export const useEditor = <T extends Element>(
  token: string,
  config: EditorConfig
): {
  state: State;
  instance: Instance | undefined;
  setNodeRef: RefCallback<T | null>;
} => {
  const { isLoaded } = useLoadEditor();
  const [state, dispatch] = useReducer(reducer, {
    status: ActionKind.idle
  });
  const nodeRef = useRef<T | null>(null);
  const builderInstance = useRef<Instance>();
  const builderGlobal = useRef<BuilderGlobal>();

  const setNodeRef: RefCallback<T | null> = (node) => {
    nodeRef.current = node;
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // @ts-expect-error: Special expected for globalTypes
    const builder: BuilderGlobal = globalThis.Builder;

    if (!builder) {
      dispatch({
        type: ActionKind.error,
        error: "missing window.Builder"
      });
      return;
    }

    dispatch({ type: ActionKind.init });
    builderGlobal.current = builder;
  }, [isLoaded]);

  useEffect(() => {
    if (state.status === ActionKind.init) {
      const builder = builderGlobal.current;
      const node = nodeRef.current;

      if (!node) {
        dispatch({
          type: ActionKind.error,
          error: "Invalid Node ref"
        });
        return;
      }

      if (!builder) {
        dispatch({
          type: ActionKind.error,
          error: "Something went wrong"
        });
        return;
      }

      const instance = (api: Instance) => {
        builderInstance.current = api;
      };

      const _onLoad = () => {
        dispatch({ type: ActionKind.ready });
        config.onLoad?.();
      };

      const _config = {
        ...config,
        container: node,
        onLoad: _onLoad
      };

      dispatch({ type: ActionKind.load });
      builder.init(token, _config, instance);
    }
  }, [state, token, config]);

  return {
    state,
    instance: builderInstance.current,
    setNodeRef
  };
};
