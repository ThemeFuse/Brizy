import classNames from "classnames";
import React, { FC } from "react";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { type Props } from "./types";

export const Tooltip: FC<Props> = ({
  overlay,
  offset,
  openOnClick,
  placement,
  id,
  className
}) => {
  const offsetAttr = makeDataAttr({
    name: "tooltip-offset",
    value: offset
  });

  const triggerAttr = makeDataAttr({
    name: "tooltip-trigger",
    value: openOnClick ? "click" : "hover"
  });

  const placementAttr = makeDataAttr({
    name: "tooltip-placement",
    value: placement
  });

  const elementIdAttr = makeDataAttr({
    name: "element-id",
    value: id
  });

  const _className = classNames("brz-tooltip", className);

  return (
    <>
      <span
        className={_className}
        {...offsetAttr}
        {...triggerAttr}
        {...placementAttr}
        {...elementIdAttr}
      >
        {overlay}
        <span className="brz-tooltip--arrow" />
      </span>
    </>
  );
};
