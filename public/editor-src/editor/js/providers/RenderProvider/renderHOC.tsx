import React, { ForwardedRef, PropsWithChildren, forwardRef } from "react";
import { useRender } from "./";

interface HOC<T> {
  ForView: (p: PropsWithChildren<T>) => JSX.Element;
  ForEdit: (p: PropsWithChildren<T>) => JSX.Element;
}

export function renderHOC<T>(props: HOC<T>) {
  const { ForEdit, ForView } = props;

  function CanRender(
    props: PropsWithChildren<T>,
    ref: ForwardedRef<unknown>
  ): JSX.Element {
    const { renderType } = useRender();

    if (renderType === "view") {
      return <ForView {...props} />;
    }

    return <ForEdit {...props} ref={ref} />;
  }

  return forwardRef(CanRender);
}
