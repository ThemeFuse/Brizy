import classNames from "classnames";
import React, { forwardRef } from "react";
import { TransitionState } from "react-transition-state";
import { ToolbarItems } from "visual/component/Toolbar/ToolbarItems";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";

export interface ToolbarProps extends TransitionState {
  items: OptionDefinition[];
  animation?: string;
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  (props, ref) => {
    const { items, status, isMounted, animation = "leftToRight" } = props;
    if (!isMounted) {
      return null;
    }

    const animationClassName =
      animation === "leftToRight"
        ? "animation-left-right"
        : "animation-right-left";

    const className = classNames(
      "brz-ed-collapsible__toolbar",
      animationClassName,
      status
    );

    return (
      <div className={className} ref={ref}>
        <ToolbarItems items={items} arrow={false} />
      </div>
    );
  }
);
