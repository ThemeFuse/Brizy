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

  // todo: find other solution for hover check.
  // We should know from toolbar if the option has hover support or not
  return tempBorderRadiusType === undefined || state === "hover"
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
  return defaultValueValue({
    v,
    key: "iconCustomSize",
    device,
    state
  });
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
