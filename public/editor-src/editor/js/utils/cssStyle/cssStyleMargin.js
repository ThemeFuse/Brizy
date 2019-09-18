import {
  styleMarginType,
  styleMarginGrouped,
  styleMarginUngrouped,
  styleMarginGroupedSuffix,
  styleMarginUngroupedSuffix,
  styleItemMarginTop,
  styleItemMarginRight,
  styleItemMarginBottom,
  styleItemMarginLeft
} from "visual/utils/style2";

export function cssStyleMargin({ v, device, state }) {
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

  marginType = styleMarginType({ v, device, state });

  if (marginType === "grouped") {
    marginLeft = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginLeft"
    });

    if (marginLeft === "auto") {
      marginTop = marginBottom = styleMarginGrouped({
        v,
        device,
        state
      });
      marginLeft = marginRight = "auto";

      marginTopSuffix = marginBottomSuffix = styleMarginGroupedSuffix({
        v,
        device,
        state
      });
    } else {
      marginTop = marginRight = marginBottom = marginLeft = styleMarginGrouped({
        v,
        device,
        state
      });
      marginTopSuffix = marginRightSuffix = marginBottomSuffix = marginLeftSuffix = styleMarginGroupedSuffix(
        { v, device, state }
      );
    }
  } else {
    marginTop = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginTop"
    });
    marginRight = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginRight"
    });
    marginBottom = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginBottom"
    });
    marginLeft = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginLeft"
    });

    marginTopSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginTopSuffix"
    });
    marginRightSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginRightSuffix"
    });
    marginBottomSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginBottomSuffix"
    });
    marginLeftSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginLeftSuffix"
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

export function cssStyleItemMargin({ v, device, state }) {
  const marginTop = styleItemMarginTop({
    v,
    device,
    state
  });
  const marginRight = styleItemMarginRight({
    v,
    device,
    state
  });
  const marginBottom = styleItemMarginBottom({
    v,
    device,
    state
  });
  const marginLeft = styleItemMarginLeft({
    v,
    device,
    state
  });

  return `margin:${marginTop} ${marginRight} ${marginBottom} ${marginLeft};`;
}
