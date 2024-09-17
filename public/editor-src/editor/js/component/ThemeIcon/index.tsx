import cn from "classnames";
import React, { useMemo } from "react";
import { templateIconUrl, compileTemplateIconUrl } from "visual/utils/icons";
import { IconTypes } from "visual/config/icons/Type";
import Config from "visual/global/Config";
import { CustomIcon } from "./Custom";
import { ThemeIconProps as Props } from "./types";
import { makePlaceholder } from "visual/utils/dynamicContent";

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

const ThemeIconPreview = (props: Props): JSX.Element => {
  const { type, name, className: _className, filename } = props;
  const urls = Config.getAll().urls;
  const { compileTemplateIconsPlaceholder } = urls;
  const className = cn("brz-icon-svg align-[initial]", _className);

  if (type === IconTypes.Custom) {
    return (
      <CustomIcon
        src={getIconUrl({
          type,
          filename,
          iconName: name,
          suffix: getSuffix(type)
        })}
        className={className}
      />
    );
  }

  return compileTemplateIconsPlaceholder ? (
    <>
      {makePlaceholder({
        content: compileTemplateIconsPlaceholder,
        attr: { type, name, class: className }
      })}
    </>
  ) : (
    <Svg
      className={className}
      href={getIconUrl({ type, iconName: name, suffix: getSuffix(type) })}
    />
  );
};

const ThemeIconEditor = (props: Props): JSX.Element => {
  const { className: _className, type, name, filename } = props;
  const className = cn("brz-icon-svg align-[initial]", _className);

  const pathToIcon = useMemo(() => {
    const suffix = getSuffix(type);
    return getIconUrl({ type, iconName: name, filename, suffix });
  }, [type, name, filename]);

  return type === IconTypes.Custom ? (
    <CustomIcon className={className} src={pathToIcon} />
  ) : (
    <Svg className={className} href={pathToIcon} />
  );
};

export const ThemeIcon = (props: Props): JSX.Element =>
  IS_EDITOR ? <ThemeIconEditor {...props} /> : <ThemeIconPreview {...props} />;
