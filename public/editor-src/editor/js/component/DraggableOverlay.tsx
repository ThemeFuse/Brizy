import React, { FC } from "react";
import classNames from "classnames";

type DraggableOverlayProps = {
  className?: string;
};

export const DraggableOverlay: FC<DraggableOverlayProps> = ({ className }) => {
  const _className = classNames("brz-ed-draggable-overlay", className);
  return <div className={_className} />;
};
