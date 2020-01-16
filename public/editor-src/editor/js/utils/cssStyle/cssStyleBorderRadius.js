import {
  styleBorderRadiusType,
  styleBorderRadiusGrouped,
  styleBorderRadiusUngrouped
} from "visual/utils/style2";

export function cssStyleBorderRadius({ v, device, state, prefix = "" }) {
  let topLeftRadius = 0;
  let topRightRadius = 0;
  let bottomLeftRadius = 0;
  let bottomRightRadius = 0;
  let radiusType = styleBorderRadiusType({ v, device, state, prefix });

  if (radiusType === "grouped") {
    const radius = styleBorderRadiusGrouped({ v, device, state, prefix });

    topLeftRadius = radius;
    topRightRadius = radius;
    bottomLeftRadius = radius;
    bottomRightRadius = radius;
  } else {
    topLeftRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix,
      current: "topLeft"
    });
    topRightRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix,
      current: "topRight"
    });
    bottomLeftRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix,
      current: "bottomLeft"
    });
    bottomRightRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix,
      current: "bottomRight"
    });
  }

  if (topLeftRadius === undefined) {
    return "";
  } else if (
    topLeftRadius === topRightRadius &&
    topLeftRadius === bottomLeftRadius &&
    topLeftRadius === bottomRightRadius &&
    topLeftRadius > 0
  ) {
    return `border-radius: ${topLeftRadius}px;`;
  } else if (
    topLeftRadius > 0 ||
    topRightRadius > 0 ||
    bottomLeftRadius > 0 ||
    bottomRightRadius > 0
  ) {
    return `border-radius:${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px;`;
  } else {
    return "border-radius:0;";
  }
}
