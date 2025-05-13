import classNames from "classnames";
import React from "react";
import { TransitionState } from "react-transition-state";
import EditorIcon from "visual/component/EditorIcon";

export interface IconProps extends TransitionState {
  onClick?: () => void;
}

export function Icon({ onClick, status, isMounted }: IconProps) {
  if (!isMounted) {
    return null;
  }

  const className = classNames(
    "brz-ed-collapsible__icon",
    "brz-ed-fade",
    status
  );
  return (
    <div className={className} onClick={onClick}>
      <EditorIcon icon="nc-settings" />
    </div>
  );
}
