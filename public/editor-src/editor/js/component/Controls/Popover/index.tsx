import React, { FC, PropsWithChildren, ReactElement } from "react";
import classNames from "classnames";
import {
  Tooltip,
  Props as TooltipProps
} from "visual/component/Controls/Tooltip";
import { WithClassName } from "visual/utils/options/attributes";

export type Props = WithClassName &
  PropsWithChildren<unknown> & {
    toolbar?: TooltipProps["toolbar"];
    trigger: ReactElement;
    onOpen?: () => void;
    onClose?: () => void;
    title?: string;
    size: "small" | "medium" | "large" | "auto";
    clickOutsideExceptions?: string[];
    placement: TooltipProps["placement"];
  };

export const Popover: FC<Props> = ({
  className,
  title,
  size,
  placement,
  onOpen,
  onClose,
  children,
  trigger,
  toolbar,
  clickOutsideExceptions = []
}) => {
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
      >
        {trigger}
      </Tooltip>
    </div>
  );
};
