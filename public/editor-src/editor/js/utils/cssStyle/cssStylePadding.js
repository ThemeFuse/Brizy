import {
  stylePaddingType,
  stylePaddingGrouped,
  stylePaddingUngrouped,
  stylePaddingGroupedSuffix,
  stylePaddingUngroupedSuffix,
  styleItemPaddingTop,
  styleItemPaddingRight,
  styleItemPaddingBottom,
  styleItemPaddingLeft
} from "visual/utils/style2";

export function cssStylePadding({ v, device, state }) {
  let r = "";
  let paddingType = "";
  let paddingTop = 0;
  let paddingRight = 0;
  let paddingBottom = 0;
  let paddingLeft = 0;
  let paddingTopSuffix = "";
  let paddingRightSuffix = "";
  let paddingBottomSuffix = "";
  let paddingLeftSuffix = "";

  paddingType = stylePaddingType({ v, device, state });

  if (paddingType === "grouped") {
    paddingRight = stylePaddingUngrouped({
      v,
      device,
      state,
      current: "paddingRight"
    });

    if (paddingRight === "initial") {
      paddingTop = paddingBottom = stylePaddingGrouped({
        v,
        device,
        state
      });

      paddingTopSuffix = paddingBottomSuffix = stylePaddingGroupedSuffix({
        v,
        device,
        state
      });
    } else {
      paddingTop = paddingRight = paddingBottom = paddingLeft = stylePaddingGrouped(
        {
          v,
          device,
          state
        }
      );

      paddingTopSuffix = paddingRightSuffix = paddingBottomSuffix = paddingLeftSuffix = stylePaddingGroupedSuffix(
        { v, device, state }
      );
    }
  } else {
    paddingTop = stylePaddingUngrouped({
      v,
      device,
      state,
      current: "paddingTop"
    });
    paddingRight = stylePaddingUngrouped({
      v,
      device,
      state,
      current: "paddingRight"
    });
    paddingBottom = stylePaddingUngrouped({
      v,
      device,
      state,
      current: "paddingBottom"
    });
    paddingLeft = stylePaddingUngrouped({
      v,
      device,
      state,
      current: "paddingLeft"
    });

    paddingTopSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      current: "paddingTopSuffix"
    });
    paddingRightSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      current: "paddingRightSuffix"
    });
    paddingBottomSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      current: "paddingBottomSuffix"
    });
    paddingLeftSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      current: "paddingLeftSuffix"
    });
  }

  const noEmptyGrouped =
    paddingTop === paddingRight &&
    paddingTop === paddingBottom &&
    paddingTop === paddingLeft &&
    paddingTop > 0;

  const noEmptyUngrouped =
    paddingTop > 0 || paddingRight > 0 || paddingBottom > 0 || paddingLeft > 0;

  if (paddingRight === "initial") {
    paddingRight = paddingLeft = 0;
  }

  if (paddingTop === undefined) r = "";
  else if (noEmptyGrouped) r = `padding:${paddingTop}${paddingTopSuffix};`;
  else if (noEmptyUngrouped)
    r = `padding:${paddingTop}${paddingTopSuffix} ${paddingRight}${paddingRightSuffix} ${paddingBottom}${paddingBottomSuffix} ${paddingLeft}${paddingLeftSuffix};`;
  else r = "padding:0;";

  return r;
}

export function cssStyleItemPadding({ v, device, state }) {
  const paddingTop = styleItemPaddingTop({
    v,
    device,
    state
  });
  const paddingRight = styleItemPaddingRight({
    v,
    device,
    state
  });
  const paddingBottom = styleItemPaddingBottom({
    v,
    device,
    state
  });
  const paddingLeft = styleItemPaddingLeft({
    v,
    device,
    state
  });

  return `padding:${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft};`;
}

export function cssStylePaddingSection({ v, device, state }) {
  if (IS_PREVIEW) return cssStylePadding({ v, device, state });
}
