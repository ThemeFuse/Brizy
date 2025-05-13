import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  JSX,
  PropsWithoutRef,
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
    props: PropsWithoutRef<P>,
    ref: ForwardedRef<P>
  ): JSX.Element {
    const { renderType } = useRender();

    if (renderType === "view") {
      // @ts-expect-error: TS2322: Type PropsWithoutRef<P> is not assignable to type IntrinsicAttributes & P
      return <ForView {...props} />;
    }

    // @ts-expect-error: TS2322: Type PropsWithoutRef<P> is not assignable to type IntrinsicAttributes & P
    return <ForEdit {...props} ref={ref} />;
  }

  CanRender.displayName = `RenderHOC(${ForEdit.displayName || ForView.displayName})`;

  return forwardRef(CanRender);
}
