import { defaultValueValue } from "visual/utils/onChange";

export function styleElementButtonBorderRadius({ v, device, state }) {
  const tempBorderRadiusType = defaultValueValue({
    v,
    key: "tempBorderRadiusType",
    device,
    state
  });
  const borderRadius = defaultValueValue({
    v,
    key: "borderRadius",
    device,
    state
  });

  return tempBorderRadiusType === undefined
    ? undefined
    : tempBorderRadiusType === "rounded"
    ? 500
    : borderRadius;
}

export function styleElementButtonIconPosition({ v, device, state }) {
  const iconPosition = defaultValueValue({
    v,
    key: "iconPosition",
    device,
    state
  });

  return iconPosition === undefined ? undefined : iconPosition;
}

export function styleElementButtonIconPositionCss({ v, device, state }) {
  const iconPosition = styleElementButtonIconPosition({ v, device, state });

  return iconPosition === undefined
    ? undefined
    : iconPosition === "left"
    ? "row nowrap"
    : "row-reverse nowrap";
}

export function styleElementButtonIconCustomSize({ v, device, state }) {
  const iconCustomSize = defaultValueValue({
    v,
    key: "iconCustomSize",
    device,
    state
  });

  return iconCustomSize;
}

export function styleElementButtonIconMargin({ v, device, state }) {
  const iconPosition = styleElementButtonIconPosition({ v, device, state });
  const iconSpacing = defaultValueValue({
    v,
    key: "iconSpacing",
    device,
    state
  });

  return iconPosition === undefined || iconSpacing === undefined
    ? undefined
    : iconSpacing;
}

export function styleElementIconStrokeWidth({ v, device, state }) {
  const iconCustomSize = defaultValueValue({
    v,
    key: "iconCustomSize",
    device,
    state
  });
  const iconType = defaultValueValue({
    v,
    key: "iconType",
    device,
    state
  });

  return iconType === undefined || iconCustomSize === undefined
    ? undefined
    : iconType === "outline" && iconCustomSize <= 24
    ? 1
    : iconType === "outline" && iconCustomSize > 24 && iconCustomSize <= 32
    ? 1.1
    : iconType === "outline" && iconCustomSize > 32 && iconCustomSize <= 48
    ? 1.4
    : iconType === "outline" && iconCustomSize > 48 && iconCustomSize <= 64
    ? 2.3
    : iconType === "outline" && iconCustomSize > 64
    ? 3
    : 0;
}
