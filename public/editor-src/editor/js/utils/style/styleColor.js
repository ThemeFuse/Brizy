import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleColor({ v, device, state, store, prefix = "color" }) {
  const isHover = styleState({ v, state }) === "hover";

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const dvvH = (key) => defaultValueValue({ v, key, device, state: "hover" });
  const config = configSelector(store.getState());

  const colorHex = dvv(`${prefix}Hex`);
  const colorPalette = dvv(`${prefix}Palette`);
  const colorOpacity = dvv(`${prefix}Opacity`);

  const hoverColorHex = dvvH(`${prefix}Hex`);
  const hoverColorPalette = dvvH(`${prefix}Palette`);
  const hoverColorOpacity = dvvH(`${prefix}Opacity`);

  if (isHover) {
    return getColor(
      hoverColorPalette,
      hoverColorHex,
      hoverColorOpacity,
      config
    );
  } else {
    return getColor(colorPalette, colorHex, colorOpacity, config);
  }
}
