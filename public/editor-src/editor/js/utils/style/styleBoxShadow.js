import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { styleState } from "visual/utils/style";

export function styleBoxShadow({ v, device, state }) {
  const isHover = styleState({ v, state });
  const boxShadow = defaultValueValue({ v, key: "boxShadow", device, state });
  let boxShadowHorizontal = defaultValueValue({
    v,
    key: "boxShadowHorizontal",
    device,
    state
  });
  let boxShadowVertical = defaultValueValue({
    v,
    key: "boxShadowVertical",
    device,
    state
  });
  const boxShadowBlur = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state
  });
  const boxShadowSpread = defaultValueValue({
    v,
    key: "boxShadowSpread",
    device,
    state
  });
  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device, state }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device, state })
  );
  const boxShadowColorOpacity = defaultValueValue({
    v,
    key: "boxShadowColorOpacity",
    device,
    state
  });

  const hoverBoxShadow = defaultValueValue({
    v,
    key: "boxShadow",
    device,
    state: "hover"
  });
  let hoverBoxShadowHorizontal = defaultValueValue({
    v,
    key: "boxShadowHorizontal",
    device,
    state: "hover"
  });
  let hoverBoxShadowVertical = defaultValueValue({
    v,
    key: "boxShadowVertical",
    device,
    state: "hover"
  });
  const hoverBoxShadowBlur = defaultValueValue({
    v,
    key: "boxShadowBlur",
    device,
    state: "hover"
  });
  const hoverBoxShadowSpread = defaultValueValue({
    v,
    key: "boxShadowSpread",
    device,
    state: "hover"
  });
  const { hex: hoverBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({
      v,
      key: "boxShadowColorHex",
      device,
      state: "hover"
    }),
    defaultValueValue({
      v,
      key: "boxShadowColorPalette",
      device,
      state: "hover"
    })
  );
  const hoverBoxShadowColorOpacity = defaultValueValue({
    v,
    key: "boxShadowColorOpacity",
    device,
    state: "hover"
  });

  const prefix = boxShadow === "inset" ? "inset " : "";
  const hoverPrefix = hoverBoxShadow === "inset" ? "inset " : "";

  boxShadowHorizontal =
    boxShadow === "inset" ? boxShadowHorizontal * -1 : boxShadowHorizontal;

  boxShadowVertical =
    boxShadow === "inset" ? boxShadowVertical * -1 : boxShadowVertical;

  hoverBoxShadowHorizontal =
    hoverBoxShadow === "inset"
      ? hoverBoxShadowHorizontal * -1
      : hoverBoxShadowHorizontal;

  hoverBoxShadowVertical =
    hoverBoxShadow === "inset"
      ? hoverBoxShadowVertical * -1
      : hoverBoxShadowVertical;

  return isHover === "hover" &&
    (hoverBoxShadow === "on" || hoverBoxShadow === "inset")
    ? `${hoverPrefix}${hoverBoxShadowHorizontal}px ${hoverBoxShadowVertical}px ${hoverBoxShadowBlur}px ${hoverBoxShadowSpread}px ${hexToRgba(
        hoverBoxShadowColorHex,
        hoverBoxShadowColorOpacity
      )}`
    : boxShadow === "on" || boxShadow === "inset"
    ? `${prefix}${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
        boxShadowColorHex,
        boxShadowColorOpacity
      )}`
    : "none";
}
