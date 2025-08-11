import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { ThemeIconProps } from "visual/component/ThemeIcon/types";

interface IconWrapperProps extends ThemeIconProps {
  classNameIcon: string;
  attr?: Record<string, string>;
}

export function Icon(props: IconWrapperProps) {
  const { classNameIcon, attr, ...iconProps } = props;
  return (
    <span className={classNameIcon} {...attr}>
      <ThemeIcon {...iconProps} />
    </span>
  );
}
