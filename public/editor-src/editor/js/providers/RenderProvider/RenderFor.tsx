import React from "react";
import { useRender } from "./";
import { RenderForProps as Props } from "./types";

export function RenderFor(props: Props): JSX.Element {
  const { forView, forEdit } = props;
  const { renderType } = useRender();
  return <>{renderType === "view" ? forView : forEdit}</>;
}
