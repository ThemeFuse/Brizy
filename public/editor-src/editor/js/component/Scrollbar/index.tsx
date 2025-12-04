import { Scrollbar as Component } from "@brizy/builder-ui-components/src/Scrollbar";
import {
  Props,
  ScrollbarRef,
  ScrollbarUpdateValues
} from "@brizy/builder-ui-components/src/Scrollbar/types";
import React, { ForwardRefRenderFunction, forwardRef } from "react";

const ScrollbarComponent: ForwardRefRenderFunction<ScrollbarRef, Props> = (
  {
    children,
    theme,
    autoHeightMax,
    autoHeightMin,
    className,
    style,
    absolute,
    autoHeight,
    onScroll,
    onUpdate
  },
  ref
) => (
  <Component
    ref={ref}
    className={className}
    theme={theme}
    autoHeightMax={autoHeightMax}
    autoHeightMin={autoHeightMin}
    style={style}
    absolute={absolute}
    autoHeight={autoHeight}
    onScroll={onScroll}
    onUpdate={onUpdate}
  >
    {children}
  </Component>
);

export const Scrollbar = forwardRef<ScrollbarRef, Props>(ScrollbarComponent);
export type { ScrollbarRef, ScrollbarUpdateValues };
