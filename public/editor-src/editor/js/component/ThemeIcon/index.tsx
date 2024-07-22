import cn from "classnames";
import React from "react";
import { templateIconUrl, compileTemplateIconUrl } from "visual/utils/icons";
import Config from "visual/global/Config";
import { makePlaceholder } from "visual/utils/dynamicContent";

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

const Svg = ({
  className,
  href
}: {
  className?: string;
  href: string;
}): JSX.Element => (
  <svg className={className}>
    <use href={href} />
  </svg>
);

const ThemeIconPreview = (props: ThemeIconProps): JSX.Element => {
  const { type, name, className: _className } = props;
  const urls = Config.getAll().urls;
  const { compileTemplateIconsPlaceholder } = urls;
  const className = cn("brz-icon-svg align-[initial]", _className);
  return compileTemplateIconsPlaceholder ? (
    <>
      {makePlaceholder({
        content: compileTemplateIconsPlaceholder,
        attr: { type, name, class: className }
      })}
    </>
  ) : (
    <Svg className={className} href={getIconUrl(type, name, getSuffix(type))} />
  );
};

const ThemeIconEditor = (props: ThemeIconProps): JSX.Element => {
  const { className: _className, type, name } = props;
  const className = cn("brz-icon-svg align-[initial]", _className);
  const suffix = getSuffix(type);
  const pathToIcon = getIconUrl(type, name, suffix);

  return <Svg className={className} href={pathToIcon} />;
};

export const ThemeIcon = (props: ThemeIconProps): JSX.Element =>
  IS_EDITOR ? <ThemeIconEditor {...props} /> : <ThemeIconPreview {...props} />;
