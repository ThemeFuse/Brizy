import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { styleState } from "visual/utils/style";

export function styleBoxShadow({ v, device, state }) {
  const isHover = styleState({ v, state });
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

  const hoverBoxShadow = defaultValueValue({
    v,
    key: "boxShadow",
    device,
    state: "hover"
  });
  const hoverBoxShadowHorizontal = defaultValueValue({
    v,
    key: "boxShadowHorizontal",
    device,
    state: "hover"
  });
  const hoverBoxShadowVertical = defaultValueValue({
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

  return isHover === "hover" && hoverBoxShadow === "on"
    ? `${hoverBoxShadowHorizontal}px ${hoverBoxShadowVertical}px ${hoverBoxShadowBlur}px ${hoverBoxShadowSpread}px ${hexToRgba(
        hoverBoxShadowColorHex,
        hoverBoxShadowColorOpacity
      )}`
    : boxShadow === "on"
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
