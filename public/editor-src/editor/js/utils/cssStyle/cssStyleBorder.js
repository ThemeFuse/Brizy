import {
  styleBorderStyle,
  styleBorderColor,
  styleBorderWidthType,
  styleBorderWidthGrouped,
  styleBorderWidthUngrouped
} from "visual/utils/style2";

export function cssStyleBorder({
  v,
  device,
  state,
  prefix = "",
  borderColor = "color"
}) {
  let r = "";
  let borderTopWidth = 0;
  let borderRightWidth = 0;
  let borderBottomWidth = 0;
  let borderLeftWidth = 0;
  let borderWidthType = styleBorderWidthType({ v, device, state, prefix });

  let hoverBorderWidthType = "";
  let hoverBorderTopWidth = 0;
  let hoverBorderRightWidth = 0;
  let hoverBorderBottomWidth = 0;
  let hoverBorderLeftWidth = 0;

  let normalByHoverNoEmptyUngrouped = false;
  let hoverBorderStyle = "";
  let hoverBorderColor = "";

  const borderStyle = styleBorderStyle({ v, device, state, prefix });

  borderColor =
    borderColor === "transparent"
      ? "transparent"
      : styleBorderColor({ v, device, state, prefix });

  if (borderWidthType === "grouped") {
    const borderWidth = styleBorderWidthGrouped({ v, device, state, prefix });
    borderTopWidth = borderWidth;
    borderRightWidth = borderWidth;
    borderBottomWidth = borderWidth;
    borderLeftWidth = borderWidth;
  } else {
    borderTopWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      prefix,
      current: "top"
    });
    borderRightWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      prefix,
      current: "right"
    });
    borderBottomWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      prefix,
      current: "bottom"
    });
    borderLeftWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      prefix,
      current: "left"
    });
  }

  if (state === "normal") {
    hoverBorderStyle = styleBorderStyle({ v, device, prefix, state: "hover" });

    hoverBorderColor =
      borderColor === "transparent"
        ? "transparent"
        : styleBorderColor({ v, device, prefix, state: "hover" });
    hoverBorderWidthType = styleBorderWidthType({
      v,
      device,
      prefix,
      state: "hover"
    });

    if (hoverBorderWidthType === "grouped") {
      const borderWidth = styleBorderWidthGrouped({
        v,
        device,
        state: "hover"
      });

      hoverBorderTopWidth = borderWidth;
      hoverBorderRightWidth = borderWidth;
      hoverBorderBottomWidth = borderWidth;
      hoverBorderLeftWidth = borderWidth;
    } else {
      hoverBorderTopWidth = styleBorderWidthUngrouped({
        v,
        device,
        prefix,
        state: "hover",
        current: "top"
      });
      hoverBorderRightWidth = styleBorderWidthUngrouped({
        v,
        device,
        prefix,
        state: "hover",
        current: "right"
      });
      hoverBorderBottomWidth = styleBorderWidthUngrouped({
        v,
        device,
        prefix,
        state: "hover",
        current: "bottom"
      });
      hoverBorderLeftWidth = styleBorderWidthUngrouped({
        v,
        device,
        prefix,
        state: "hover",
        current: "left"
      });
    }
    normalByHoverNoEmptyUngrouped =
      (hoverBorderTopWidth > 0 ||
        hoverBorderRightWidth > 0 ||
        hoverBorderBottomWidth > 0 ||
        hoverBorderLeftWidth > 0) &&
      hoverBorderStyle !== "";
  }

  const empty =
    (borderTopWidth === borderRightWidth &&
      borderTopWidth === borderBottomWidth &&
      borderTopWidth === borderLeftWidth &&
      borderTopWidth === 0) ||
    borderStyle === "";

  const noEmptyGrouped =
    borderTopWidth === borderRightWidth &&
    borderTopWidth === borderBottomWidth &&
    borderTopWidth === borderLeftWidth &&
    borderTopWidth > 0 &&
    borderStyle !== "";

  const noEmptyUngrouped =
    (borderTopWidth > 0 ||
      borderRightWidth > 0 ||
      borderBottomWidth > 0 ||
      borderLeftWidth > 0) &&
    borderStyle !== "";

  const emptyUndefined =
    borderTopWidth === undefined ||
    borderRightWidth === undefined ||
    borderBottomWidth === undefined ||
    borderLeftWidth === undefined ||
    borderStyle === undefined ||
    borderColor === undefined;

  if (emptyUndefined) r = "";
  else if (noEmptyGrouped)
    r = `border:${borderTopWidth}px ${borderStyle} ${borderColor};`;
  else if (noEmptyUngrouped)
    r = `border-width:${borderTopWidth}px ${borderRightWidth}px ${borderBottomWidth}px ${borderLeftWidth}px;border-style:${borderStyle};border-color:${borderColor};`;
  else if (empty && normalByHoverNoEmptyUngrouped)
    r = `border:0px ${hoverBorderStyle} ${hoverBorderColor};`;
  else r = `border:0px solid ${borderColor};`;

  return r;
}

export function cssStyleBorderTransparentColor({
  v,
  device,
  state,
  prefix = "",
  borderColor = "transparent"
}) {
  return cssStyleBorder({ v, device, state, prefix, borderColor });
}
