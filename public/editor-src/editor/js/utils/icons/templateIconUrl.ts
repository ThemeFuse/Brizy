import Config from "visual/global/Config";
import { IconTypes } from "visual/config/icons/Type";
import { TemplateIconData } from "./types";
import { getCustomIconUrl } from "./utils";

export function templateIconUrl({
  type,
  iconName,
  filename,
  suffix
}: TemplateIconData): string {
  const config = Config.getAll();
  const { urls } = config;

  if (type === IconTypes.Custom) {
    return getCustomIconUrl(config, iconName, filename);
  }

  const { templateIcons } = urls;
  const url = `${templateIcons}/${type}/${iconName}.svg`;

  return suffix === undefined ? url : `${url}#${suffix}`;
}

// This function used only on compile time
export function compileTemplateIconUrl({
  type,
  iconName,
  filename,
  suffix
}: TemplateIconData): string {
  const config = Config.getAll();
  const { urls } = config;

  if (type === IconTypes.Custom) {
    return getCustomIconUrl(config, iconName, filename);
  }

  const { templateIcons, compileTemplateIcons } = urls;

  const url = compileTemplateIcons
    ? `${compileTemplateIcons}/${type}/${iconName}.svg`
    : `${templateIcons}/${type}/${iconName}.svg`;

  return suffix === undefined ? url : `${url}#${suffix}`;
}
