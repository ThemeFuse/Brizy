import Config from "visual/global/Config";
import { makePlaceholder } from "visual/utils/dynamicContent";

export function templateIconUrl(
  type: string,
  iconName: string,
  suffix: string | undefined
): string {
  const urls = Config.getAll().urls;
  const { templateIcons } = urls;
  const url = `${templateIcons}/${type}/${iconName}.svg`;

  return suffix === undefined ? url : `${url}#${suffix}`;
}

// This function used only on compile time
export function compileTemplateIconUrl(
  type: string,
  iconName: string,
  suffix: string | undefined
): string {
  const urls = Config.getAll().urls;
  const {
    templateIcons,
    compileTemplateIcons,
    compileTemplateIconsPlaceholder
  } = urls;

  if (compileTemplateIconsPlaceholder) {
    return makePlaceholder({
      content: compileTemplateIconsPlaceholder,
      attr: { type, name: iconName }
    });
  }

  const url = compileTemplateIcons
    ? `${compileTemplateIcons}/${type}/${iconName}.svg`
    : `${templateIcons}/${type}/${iconName}.svg`;

  return suffix === undefined ? url : `${url}#${suffix}`;
}
