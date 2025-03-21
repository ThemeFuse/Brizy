import React, { ReactElement, useEffect } from "react";
import { TransitionState, useTransitionState } from "react-transition-state";
import type { BadgeProps } from "./Badge";
import type { IconProps } from "./Icon";
import type { ToolbarProps } from "./Toolbar";

interface AnimatedToolbarProps {
  opened: boolean;
  className: string;
  renderBadge: () => ReactElement<BadgeProps> | null;
  renderToolbar: (state: TransitionState) => ReactElement<ToolbarProps>;
  renderIcon: (state: TransitionState) => ReactElement<IconProps>;
}

const transitionProps = {
  timeout: 200,
  mountOnEnter: true,
  unmountOnExit: true,
  preEnter: true
};

export function AnimatedToolbar(props: AnimatedToolbarProps) {
  const { renderToolbar, renderIcon, renderBadge, className, opened } = props;

  const [toolbarState, toolbarToggle] = useTransitionState(transitionProps);
  const [iconState, iconToggle] = useTransitionState({
    ...transitionProps,
    initialEntered: true
  });

  useEffect(() => {
    toolbarToggle(opened);
    iconToggle(!opened);
  }, [iconToggle, opened, toolbarToggle]);

  return (
    <div className={className}>
      {renderBadge()}
      {renderIcon(iconState)}
      {renderToolbar(toolbarState)}
    </div>
  );
}
