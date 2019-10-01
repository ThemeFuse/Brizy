import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";

export function styleElementBreadcrumbsSpacing({ v, device, state }) {
  return `${defaultValueValue({ v, key: "textSpacing", device, state })}`;
}
