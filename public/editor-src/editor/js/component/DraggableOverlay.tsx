import React from "react";
import classNames from "classnames";

type DraggableOverlayProps = {
  className?: string;
};

export const DraggableOverlay = ({
  className
}: DraggableOverlayProps): JSX.Element => {
  const _className = classNames("brz-ed-draggable-overlay", className);
  return <div className={_className} />;
};
