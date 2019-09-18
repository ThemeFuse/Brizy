import {
  styleBorderStyle,
  styleBorderColor,
  styleBorderWidthType,
  styleBorderWidthGrouped,
  styleBorderWidthUngrouped
} from "visual/utils/style2";

export function cssStyleBorder({ v, device, state, borderColor = "color" }) {
  let r = "";
  let borderWidthType = "";
  let borderTopWidth = 0;
  let borderRightWidth = 0;
  let borderBottomWidth = 0;
  let borderLeftWidth = 0;

  let hoverBorderWidthType = "";
  let hoverBorderTopWidth = 0;
  let hoverBorderRightWidth = 0;
  let hoverBorderBottomWidth = 0;
  let hoverBorderLeftWidth = 0;

  let normalByHoverNoEmptyUngrouped = false;
  let hoverBorderStyle = "";
  let hoverBorderColor = "";

  const borderStyle = styleBorderStyle({ v, device, state });

  borderColor =
    borderColor === "transparent"
      ? "transparent"
      : styleBorderColor({
          v,
          device,
          state
        });

  borderWidthType = styleBorderWidthType({ v, device, state });

  if (borderWidthType === "grouped") {
    borderTopWidth = borderRightWidth = borderBottomWidth = borderLeftWidth = styleBorderWidthGrouped(
      {
        v,
        device,
        state
      }
    );
  } else {
    borderTopWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      current: "borderTopWidth"
    });

    borderRightWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      current: "borderRightWidth"
    });

    borderBottomWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      current: "borderBottomWidth"
    });

    borderLeftWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      current: "borderLeftWidth"
    });
  }

  if (state === "normal") {
    hoverBorderStyle = styleBorderStyle({ v, device, state: "hover" });

    hoverBorderColor =
      borderColor === "transparent"
        ? "transparent"
        : styleBorderColor({
            v,
            device,
            state: "hover"
          });

    hoverBorderWidthType = styleBorderWidthType({ v, device, state: "hover" });

    if (hoverBorderWidthType === "grouped") {
      hoverBorderTopWidth = hoverBorderRightWidth = hoverBorderBottomWidth = hoverBorderLeftWidth = styleBorderWidthGrouped(
        {
          v,
          device,
          state: "hover"
        }
      );
    } else {
      hoverBorderTopWidth = styleBorderWidthUngrouped({
        v,
        device,
        state: "hover",
        current: "borderTopWidth"
      });

      hoverBorderRightWidth = styleBorderWidthUngrouped({
        v,
        device,
        state: "hover",
        current: "borderRightWidth"
      });

      hoverBorderBottomWidth = styleBorderWidthUngrouped({
        v,
        device,
        state: "hover",
        current: "borderBottomWidth"
      });

      hoverBorderLeftWidth = styleBorderWidthUngrouped({
        v,
        device,
        state: "hover",
        current: "borderLeftWidth"
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

  //console.log(r);

  return r;
}

export function cssStyleBorderTransparentColor({
  v,
  device,
  state,
  borderColor = "transparent"
}) {
  return cssStyleBorder({ v, device, state, borderColor });
}
