import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleBoxShadow({ v, device, state }) {
  const boxShadow = defaultValueValue({ v, key: "boxShadow", device, state });
  const boxShadowHorizontal = defaultValueValue({
    v,
    key: "boxShadowHorizontal",
    device,
    state
  });
  const boxShadowVertical = defaultValueValue({
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

  return boxShadow === "on"
    ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
        boxShadowColorHex,
        boxShadowColorOpacity
      )}`
    : "none";
}

export function styleFooterBoxShadow({ v, device, state }) {
  const boxShadow = defaultValueValue({ v, key: "boxShadow", device, state });
  const boxShadowVertical = defaultValueValue({
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
  const boxShadowColorHex = defaultValueValue({
    v,
    key: "boxShadowColorHex",
    device,
    state
  });
  const boxShadowColorOpacity = defaultValueValue({
    v,
    key: "boxShadowColorOpacity",
    device,
    state
  });

  const diff = boxShadowVertical < 0 ? -boxShadowBlur : boxShadowBlur;
  const color = hexToRgba(boxShadowColorHex, boxShadowColorOpacity);
  const inBoth = boxShadowVertical === 0;

  return boxShadow === "off"
    ? "none"
    : inBoth
    ? `inset 0 ${boxShadowVertical +
        diff}px ${boxShadowBlur}px -${boxShadowBlur}px ${color},
          inset 0 -${boxShadowVertical +
            diff}px ${boxShadowBlur}px -${boxShadowBlur}px ${color}`
    : `inset 0 ${boxShadowVertical +
        diff}px ${boxShadowBlur}px -${boxShadowBlur}px ${color},
          inset 0 0 0 0 ${color}`;
}
