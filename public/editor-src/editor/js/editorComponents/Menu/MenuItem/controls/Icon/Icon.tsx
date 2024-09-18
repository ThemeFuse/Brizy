import React from "react";
import classnames from "classnames";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { IconProps } from "./types";

export const Icon = (props: IconProps): JSX.Element => {
  const { mMenu, iconName, iconType, iconFilename } = props;
  const className = classnames({ "brz-mm-menu__item__icon": mMenu });

  return (
    <ThemeIcon
      className={className}
      name={iconName}
      type={iconType}
      filename={iconFilename}
    />
  );
};
