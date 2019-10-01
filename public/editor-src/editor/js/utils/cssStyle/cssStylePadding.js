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

export function cssStylePaddingFourFields({ v, device, state }) {
  let r = "";
  const p = cssStylePadding({ v, device, state });

  const noEmptyGrouped =
    p.paddingTop === p.paddingRight &&
    p.paddingTop === p.paddingBottom &&
    p.paddingTop === p.paddingLeft &&
    p.paddingTop > 0;

  const empty =
    p.paddingTop === 0 &&
    p.paddingRight === 0 &&
    p.paddingBottom === 0 &&
    p.paddingLeft === 0;

  if (empty) r = "padding:0;";
  else if (noEmptyGrouped) r = `padding:${p.paddingTop}${p.paddingTopSuffix};`;
  else
    r = `padding:${p.paddingTop}${p.paddingTopSuffix} ${p.paddingRight}${p.paddingRightSuffix} ${p.paddingBottom}${p.paddingBottomSuffix} ${p.paddingLeft}${p.paddingLeftSuffix};`;

  return r;
}

export function cssStylePaddingPreview({ v, device, state }) {
  if (IS_PREVIEW) return cssStylePaddingFourFields({ v, device, state });
}

export function cssStylePaddingTopForEditorResizer({ v, device, state }) {
  if (IS_EDITOR) {
    let r = "";
    const p = cssStylePadding({ v, device, state });

    r = `height:${p.paddingTop}${p.paddingTopSuffix};`;

    return r;
  }
}

export function cssStylePaddingBottomForEditorResizer({ v, device, state }) {
  if (IS_EDITOR) {
    let r = "";
    const p = cssStylePadding({ v, device, state });

    r = `height:${p.paddingBottom}${p.paddingBottomSuffix};`;

    return r;
  }
}

export function cssStylePaddingRightLeftForEditor({ v, device, state }) {
  if (IS_EDITOR) {
    let r = "";
    const p = cssStylePadding({ v, device, state });

    r = `padding-right:${p.paddingRight}${p.paddingRightSuffix};padding-left:${p.paddingLeft}${p.paddingLeftSuffix};`;

    return r;
  }
}

function cssStylePadding({ v, device, state }) {
  let r = "";
  let paddingType = "grouped";
  let paddingTop = 0;
  let paddingRight = 0;
  let paddingBottom = 0;
  let paddingLeft = 0;
  let paddingTopSuffix = "px";
  let paddingRightSuffix = "px";
  let paddingBottomSuffix = "px";
  let paddingLeftSuffix = "px";

  paddingType = stylePaddingType({ v, device, state });

  if (paddingType === "grouped") {
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

  return {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingTopSuffix,
    paddingRightSuffix,
    paddingBottomSuffix,
    paddingLeftSuffix
  };
}

// #####
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
