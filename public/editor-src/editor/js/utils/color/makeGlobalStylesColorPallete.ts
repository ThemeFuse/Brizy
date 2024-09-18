import Conf, { Config } from "visual/global/Config";
import { hexToRgb } from "visual/utils/color";
import { isExternalPopup } from "visual/utils/models/modes";
import { uidByConfig } from "visual/utils/uuid";

export const makeStylePaletteCSSVar = (id: string, config: Config): string => {
  if (isExternalPopup(config)) {
    const uid = uidByConfig(config);
    return `--brz-global-${id}-${uid}`;
  }

  return `--brz-global-${id}`;
};

export const makeGlobalStylesColorPalette = (
  palettes: { id: string; hex: string }[]
): string => {
  const config = Conf.getAll();

  const vars = palettes
    .map(
      ({ id, hex }) => `${makeStylePaletteCSSVar(id, config)}:${hexToRgb(hex)};`
    )
    .join("");
  return `:root{${vars}}`;
};
