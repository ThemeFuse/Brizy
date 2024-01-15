import cn from "classnames";
import React, { ReactElement } from "react";
import { templateIconUrl } from "visual/utils/icons";

interface ThemeIconProps {
  name: string;
  type: string;
  className?: string;
}

export const ThemeIcon = ({
  className: _className,
  type,
  name
}: ThemeIconProps): ReactElement | null => {
  const className = cn("brz-icon-svg align-[initial]", _className);
  const pathToIcon = templateIconUrl(type, name);

  return (
    <svg className={className}>
      <use href={pathToIcon} />
    </svg>
  );
};
