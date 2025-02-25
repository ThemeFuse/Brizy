import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleBgColor({ v, device, state, store, prefix = "bg" }) {
  const isHover = styleState({ v, state }) === "hover";

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const dvvH = (key) => defaultValueValue({ v, key, device, state: "hover" });
  const config = configSelector(store.getState());

  const bgColorType = defaultValueValue({
    v,
    key: `${prefix}ColorType`,
    device,
    state
  });

  const bgColorHex = dvv(`${prefix}ColorHex`);
  const bgColorPalette = dvv(`${prefix}ColorPalette`);
  const bgColorOpacity = dvv(`${prefix}ColorOpacity`);

  const hoverBgColorType = defaultValueValue({
    v,
    key: `${prefix}ColorType`,
    device,
    state: "hover"
  });

  const hoverBgColorHex = dvvH(`${prefix}ColorHex`);
  const hoverBgColorPalette = dvvH(`${prefix}ColorPalette`);
  const hoverBgColorOpacity = dvvH(`${prefix}ColorOpacity`);

  if (isHover && hoverBgColorType === "solid") {
    return getColor(
      hoverBgColorPalette,
      hoverBgColorHex,
      hoverBgColorOpacity,
      config
    );
  } else if (bgColorType === "solid") {
    return getColor(bgColorPalette, bgColorHex, bgColorOpacity, config);
  } else {
    return "transparent";
  }
}
