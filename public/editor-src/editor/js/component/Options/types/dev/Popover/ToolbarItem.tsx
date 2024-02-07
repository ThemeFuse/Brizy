import React, { ReactElement } from "react";
import { Content } from "visual/component/Options/types/dev/Popover/Content";
import { ToolbarItemProps } from "./types";

export const ToolbarItems = ({
  className,
  options
}: ToolbarItemProps): ReactElement => (
  <div className={className}>
    <Content options={options} />
  </div>
);
