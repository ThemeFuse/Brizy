import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { ThemeIconProps } from "visual/component/ThemeIcon/types";

interface IconWrapperProps extends ThemeIconProps {
  classNameIcon: string;
}

export function Icon(props: IconWrapperProps) {
  const { classNameIcon, ...iconProps } = props;
  return (
    <span className={classNameIcon}>
      <ThemeIcon {...iconProps} />
    </span>
  );
}
