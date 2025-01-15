import cn from "classnames";
import React, { useMemo } from "react";
import { IconTypes } from "visual/config/icons/Type";
import { useConfig } from "visual/global/hooks";
import { RenderFor } from "visual/providers/RenderProvider/RenderFor";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { compileTemplateIconUrl, templateIconUrl } from "visual/utils/icons";
import { CustomIcon } from "./Custom";
import { ThemeIconProps as Props } from "./types";

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

  const config = useConfig();
  const className = cn("brz-icon-svg align-[initial]", _className);

  if (type === IconTypes.Custom) {
    return (
      <CustomIcon
        src={compileTemplateIconUrl({
          type,
          filename,
          iconName: name,
          suffix: getSuffix(type)
        })}
        className={className}
      />
    );
  }

  return config?.urls?.compileTemplateIconsPlaceholder ? (
    <>
      {makePlaceholder({
        content: config?.urls?.compileTemplateIconsPlaceholder,
        attr: { type, name, class: className }
      })}
    </>
  ) : (
    <Svg
      className={className}
      href={compileTemplateIconUrl({
        type,
        iconName: name,
        suffix: getSuffix(type)
      })}
    />
  );
};

const ThemeIconEditor = (props: Props): JSX.Element => {
  const { className: _className, type, name, filename } = props;
  const className = cn("brz-icon-svg align-[initial]", _className);

  const pathToIcon = useMemo(() => {
    const suffix = getSuffix(type);
    return templateIconUrl({ type, iconName: name, filename, suffix });
  }, [type, name, filename]);

  return type === IconTypes.Custom ? (
    <CustomIcon className={className} src={pathToIcon} />
  ) : (
    <Svg className={className} href={pathToIcon} />
  );
};

export const ThemeIcon = (props: Props): JSX.Element => {
  return (
    <RenderFor
      forView={<ThemeIconPreview {...props} />}
      forEdit={<ThemeIconEditor {...props} />}
    />
  );
};
