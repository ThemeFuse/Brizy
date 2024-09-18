import React, { JSX } from "react";
import { Icon } from "./Icon";
import { Label } from "./Label";
import { IconLabel as Props } from "./types";

export const IconLabel = ({
  icon,
  className,
  title,
  label,
  helperContent,
  onClick
}: Props): JSX.Element => (
  <div className={className} title={title} onClick={onClick}>
    <Icon icon={icon} />
    {(label || helperContent) && (
      <Label label={label} helperContent={helperContent} />
    )}
  </div>
);
