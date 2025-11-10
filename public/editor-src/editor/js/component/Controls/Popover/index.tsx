import classNames from "classnames";
import React from "react";
import { Tooltip } from "visual/component/Controls/Tooltip";
import { Props } from "./types";

export const Popover = ({
  className,
  title,
  size,
  placement,
  onOpen,
  onClose,
  children,
  trigger,
  toolbar,
  clickOutsideExceptions = [],
  inPortal
}: Props): JSX.Element => {
  const _className = classNames("brz-ed-control__popover", className);
  const content = (
    <div className="brz-ed-control__popover--content">{children}</div>
  );

  return (
    <div className={_className}>
      <Tooltip
        className="brz-ed-control__popover--tooltip"
        placement={placement}
        overlay={content}
        title={title}
        size={size}
        onOpen={onOpen}
        onClose={onClose}
        openOnClick={true}
        toolbar={toolbar}
        clickOutsideExceptions={clickOutsideExceptions}
        inPortal={inPortal}
      >
        {trigger}
      </Tooltip>
    </div>
  );
};
