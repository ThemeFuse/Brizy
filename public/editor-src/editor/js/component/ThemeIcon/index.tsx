import cn from "classnames";
import React, { ReactElement } from "react";
import { templateIconUrl, compileTemplateIconUrl } from "visual/utils/icons";

interface ThemeIconProps {
  name: string;
  type: string;
  className?: string;
}

type Suffix = "nc_icon" | "brz_icon" | "fa_icon";

function getSuffix(type: string): Suffix {
  switch (type) {
    case "editor": {
      return "brz_icon";
    }
    case "fa": {
      return "fa_icon";
    }
    default: {
      return "nc_icon";
    }
  }
}

const getIconUrl = IS_EDITOR ? templateIconUrl : compileTemplateIconUrl;

export const ThemeIcon = ({
  className: _className,
  type,
  name
}: ThemeIconProps): ReactElement | null => {
  const className = cn("brz-icon-svg align-[initial]", _className);
  const suffix = getSuffix(type);
  const pathToIcon = getIconUrl(type, name, suffix);

  return (
    <svg className={className}>
      <use href={pathToIcon} />
    </svg>
  );
};
