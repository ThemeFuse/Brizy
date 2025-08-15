import { IconTypes } from "visual/config/icons/Type";
import { TemplateIconData } from "./types";
import { getCustomIconUrl } from "./utils";

export function templateIconUrl({
  type,
  iconName,
  filename,
  suffix,
  config
}: TemplateIconData): string {
  if (type === IconTypes.Custom) {
    return getCustomIconUrl(config, iconName, filename);
  }

  const { templateIcons } = config.urls ?? {};
  const url = `${templateIcons}/${type}/${iconName}.svg`;

  return suffix === undefined ? url : `${url}#${suffix}`;
}

// This function used only on compile time
export function compileTemplateIconUrl({
  type,
  iconName,
  filename,
  suffix,
  config
}: TemplateIconData): string {
  if (type === IconTypes.Custom) {
    return getCustomIconUrl(config, iconName, filename, true);
  }

  const { templateIcons, compileTemplateIcons } = config.urls ?? {};

  const url = compileTemplateIcons
    ? `${compileTemplateIcons}/${type}/${iconName}.svg`
    : `${templateIcons}/${type}/${iconName}.svg`;

  return suffix === undefined ? url : `${url}#${suffix}`;
}
