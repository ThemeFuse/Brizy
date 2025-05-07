import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { hexToRgb } from "visual/utils/color";
import { isExternalPopup } from "visual/utils/models/modes";
import { uidByConfig } from "visual/utils/uuid";

export const makeStylePaletteCSSVar = (
  id: string,
  config: ConfigCommon
): string => {
  if (isExternalPopup(config)) {
    const uid = uidByConfig(config);
    return `--brz-global-${id}-${uid}`;
  }

  return `--brz-global-${id}`;
};

export const makeGlobalStylesColorPalette = (
  palettes: { id: string; hex: string }[],
  config: ConfigCommon
): string => {
  const vars = palettes
    .map(
      ({ id, hex }) => `${makeStylePaletteCSSVar(id, config)}:${hexToRgb(hex)};`
    )
    .join("");
  return `:root{${vars}}`;
};
