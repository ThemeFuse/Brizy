import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  PropsWithChildren,
  forwardRef
} from "react";
import { useRender } from "./";

interface HOC<T, P> {
  ForView: ForwardRefRenderFunction<T, P>;
  ForEdit: ForwardRefRenderFunction<T, P>;
}

export function renderHOC<T = HTMLElement, P = Record<string, unknown>>(
  props: HOC<T, P>
) {
  const { ForEdit, ForView } = props;

  function CanRender(
    props: PropsWithChildren<P>,
    ref: ForwardedRef<unknown>
  ): JSX.Element {
    const { renderType } = useRender();

    if (renderType === "view") {
      return <ForView {...props} />;
    }

    return <ForEdit {...props} ref={ref} />;
  }

  CanRender.displayName = `RenderHOC(${ForEdit.displayName || ForView.displayName})`;

  return forwardRef(CanRender);
}
