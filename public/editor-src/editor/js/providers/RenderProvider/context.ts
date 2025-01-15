import { createContext } from "react";

export type RenderType = "editor" | "view";

export interface WithRenderContext {
  renderContext: RenderType;
}

interface RenderProvider {
  renderType: RenderType;
}

export const RenderContext = createContext<RenderProvider>({
  renderType: "editor"
});

export function isRenderContext(value: string): value is RenderType {
  return ["editor", "view"].indexOf(value) !== -1;
}

export function isEditor(v: string): v is "editor" {
  throwErrorIfNotContext(v);
  return v === "editor";
}

export function isView(v: string): v is "view" {
  throwErrorIfNotContext(v);
  return v === "view";
}

function throwErrorIfNotContext(v: string): void {
  const env = process.env.NODE_ENV;
  if (!isRenderContext(v) && (env === "development" || env === "test")) {
    throw new Error("RENDER CONTEXT HAS WRONG VALUE:" + v);
  }
}
