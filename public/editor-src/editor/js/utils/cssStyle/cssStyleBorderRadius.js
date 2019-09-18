import {
  styleBorderRadiusType,
  styleBorderRadiusGrouped,
  styleBorderRadiusUngrouped
} from "visual/utils/style2";

export function cssStyleBorderRadius({ v, device, state }) {
  let r = "";
  let borderRadiusType = "";
  let borderTopLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderBottomRightRadius = 0;

  borderRadiusType = styleBorderRadiusType({ v, device, state });

  if (borderRadiusType === "grouped") {
    borderTopLeftRadius = borderTopRightRadius = borderBottomLeftRadius = borderBottomRightRadius = styleBorderRadiusGrouped(
      { v, device, state }
    );
  } else {
    borderTopLeftRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      current: "borderTopLeftRadius"
    });
    borderTopRightRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      current: "borderTopRightRadius"
    });
    borderBottomLeftRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      current: "borderBottomLeftRadius"
    });
    borderBottomRightRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      current: "borderBottomRightRadius"
    });
  }

  const noEmptyGrouped =
    borderTopLeftRadius === borderTopRightRadius &&
    borderTopLeftRadius === borderBottomLeftRadius &&
    borderTopLeftRadius === borderBottomRightRadius &&
    borderTopLeftRadius > 0;

  const noEmptyUngrouped =
    borderTopLeftRadius > 0 ||
    borderTopRightRadius > 0 ||
    borderBottomLeftRadius > 0 ||
    borderBottomRightRadius > 0;

  if (borderTopLeftRadius === undefined) r = "";
  else if (noEmptyGrouped) r = `border-radius: ${borderTopLeftRadius}px;`;
  else if (noEmptyUngrouped)
    r = `border-radius:${borderTopLeftRadius}px ${borderTopRightRadius}px ${borderBottomRightRadius}px ${borderBottomLeftRadius}px;`;
  else r = "border-radius:0;";

  return r;
}
