import React, { useContext, useMemo } from "react";
import {
  isEditor,
  isRenderContext,
  isView,
  RenderContext,
  type RenderType,
  type WithRenderContext
} from "./context";
import type { Props } from "./types";

export type { RenderType, WithRenderContext };
export { isEditor, isRenderContext, isView };

export function RenderProvider(props: Props): JSX.Element {
  const { children, renderType } = props;
  const value = useMemo(() => ({ renderType }), [renderType]);

  return (
    <RenderContext.Provider value={value}>{children}</RenderContext.Provider>
  );
}

export const useRender = () => {
  const context = useContext(RenderContext);

  if (!context) {
    throw new Error("Used hooks outside of RenderProvider");
  }

  return context;
};
