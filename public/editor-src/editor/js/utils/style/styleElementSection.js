import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { styleState } from "visual/utils/style";

export function styleElementSectionContainerSize({ v }) {
  const { containerType, containerSize } = v;
  return containerType === "boxed" ? `${containerSize}%` : `100%`;
}

export function styleElementSectionBoxShadow({ v, device, state }) {
  const isHover = styleState({ v, state });

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
  const { hex: hoverBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device, state: "hover" }),
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

  const diff = boxShadowVertical < 0 ? -boxShadowBlur : boxShadowBlur;
  const color = hexToRgba(boxShadowColorHex, boxShadowColorOpacity);
  const inBoth = boxShadowVertical === 0;

  const hoverDiff =
    hoverBoxShadowVertical < 0 ? -hoverBoxShadowBlur : hoverBoxShadowBlur;
  const hoverColor = hexToRgba(
    hoverBoxShadowColorHex,
    hoverBoxShadowColorOpacity
  );
  const hoverInBoth = hoverBoxShadowVertical === 0;

  const prefix = boxShadow === "inset" ? "inset " : "";
  const hoverPrefix = hoverBoxShadow === "inset" ? "inset " : "";

  return isHover === "hover" &&
    (hoverBoxShadow === "on" || hoverBoxShadow === "inset")
    ? hoverInBoth
      ? `${hoverPrefix} 0 ${hoverBoxShadowVertical +
          hoverDiff}px ${hoverBoxShadowBlur}px -${hoverBoxShadowBlur}px ${hoverColor}, ${hoverPrefix} 0 -${hoverBoxShadowVertical +
          hoverDiff}px ${hoverBoxShadowBlur}px -${hoverBoxShadowBlur}px ${hoverColor}`
      : `${hoverPrefix} 0 ${hoverBoxShadowVertical +
          hoverDiff}px ${hoverBoxShadowBlur}px -${hoverBoxShadowBlur}px ${hoverColor}, ${hoverPrefix} 0 0 0 0 ${hoverColor}`
    : boxShadow === "on" || boxShadow === "inset"
    ? inBoth
      ? `${prefix} 0 ${boxShadowVertical +
          diff}px ${boxShadowBlur}px -${boxShadowBlur}px ${color}, ${prefix} 0 -${boxShadowVertical +
          diff}px ${boxShadowBlur}px -${boxShadowBlur}px ${color}`
      : `${prefix} 0 ${boxShadowVertical +
          diff}px ${boxShadowBlur}px -${boxShadowBlur}px ${color}, ${prefix} 0 0 0 0 ${color}`
    : "none";
}
