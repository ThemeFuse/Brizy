import {
  styleMarginGrouped,
  styleMarginGroupedSuffix,
  styleMarginType,
  styleMarginUngrouped,
  styleMarginUngroupedSuffix
} from "visual/utils/style2";

export function cssStyleMargin({ v, device, state, prefix = "" }) {
  let r = "";
  let marginType = "";
  let marginTop = 0;
  let marginRight = 0;
  let marginBottom = 0;
  let marginLeft = 0;
  let marginTopSuffix = "";
  let marginRightSuffix = "";
  let marginBottomSuffix = "";
  let marginLeftSuffix = "";

  marginType = styleMarginType({ v, device, state, prefix });

  if (marginType === "grouped") {
    marginLeft = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginLeft",
      prefix
    });

    if (marginLeft === "auto") {
      marginTop = marginBottom = styleMarginGrouped({
        v,
        device,
        state,
        prefix
      });
      marginLeft = marginRight = "auto";

      marginTopSuffix = marginBottomSuffix = styleMarginGroupedSuffix({
        v,
        device,
        state,
        prefix
      });
    } else {
      marginTop =
        marginRight =
        marginBottom =
        marginLeft =
          styleMarginGrouped({
            v,
            device,
            state,
            prefix
          });
      marginTopSuffix =
        marginRightSuffix =
        marginBottomSuffix =
        marginLeftSuffix =
          styleMarginGroupedSuffix({ v, device, state, prefix });
    }
  } else {
    marginTop = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginTop",
      prefix
    });
    marginRight = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginRight",
      prefix
    });
    marginBottom = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginBottom",
      prefix
    });
    marginLeft = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginLeft",
      prefix
    });

    marginTopSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginTopSuffix",
      prefix
    });
    marginRightSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginRightSuffix",
      prefix
    });
    marginBottomSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginBottomSuffix",
      prefix
    });
    marginLeftSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginLeftSuffix",
      prefix
    });
  }

  const noEmptyGrouped =
    marginTop === marginRight &&
    marginTop === marginBottom &&
    marginTop === marginLeft &&
    marginTop !== 0;

  const noEmptyUngrouped =
    marginTop !== 0 ||
    marginRight !== 0 ||
    marginBottom !== 0 ||
    marginLeft !== 0;

  if (marginTop === undefined) r = "";
  else if (noEmptyGrouped) r = `margin:${marginTop}${marginTopSuffix};`;
  else if (noEmptyUngrouped)
    r = `margin:${marginTop}${marginTopSuffix} ${marginRight}${marginRightSuffix} ${marginBottom}${marginBottomSuffix} ${marginLeft}${marginLeftSuffix};`;
  else r = "margin:0;";

  return r;
}
