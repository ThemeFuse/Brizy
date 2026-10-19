import classNames from "classnames";
import React from "react";

type DraggableOverlayProps = {
  className?: string;
};

export const DraggableOverlay = ({
  className
}: DraggableOverlayProps): JSX.Element => {
  const _className = classNames("brz-ed-draggable-overlay", className);
  return <div className={_className} />;
};
