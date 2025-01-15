import React, { useContext, useMemo } from "react";
import {
  RenderContext,
  RenderType,
  WithRenderContext,
  isEditor,
  isRenderContext,
  isView
} from "./context";
import { Props } from "./types";

export { isRenderContext, isEditor, isView };
export type { WithRenderContext, RenderType };

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
