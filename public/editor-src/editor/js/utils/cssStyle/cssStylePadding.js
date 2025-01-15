import { isEditor, isView } from "visual/providers/RenderProvider";
import {
  stylePaddingGrouped,
  stylePaddingGroupedSuffix,
  stylePaddingType,
  stylePaddingUngrouped,
  stylePaddingUngroupedSuffix
} from "visual/utils/style2";

export function cssStylePaddingFourFields({ v, device, state, prefix = "" }) {
  const p = cssStylePadding({ v, device, state, prefix });

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

  if (empty) {
    return "padding:0;";
  } else if (noEmptyGrouped) {
    return `padding:${p.paddingTop}${p.paddingTopSuffix};`;
  } else {
    return `padding:${p.paddingTop}${p.paddingTopSuffix} ${p.paddingRight}${p.paddingRightSuffix} ${p.paddingBottom}${p.paddingBottomSuffix} ${p.paddingLeft}${p.paddingLeftSuffix};`;
  }
}

export function cssStylePaddingPreview({ v, device, state, renderContext }) {
  if (isView(renderContext))
    return cssStylePaddingFourFields({ v, device, state });
}

export function cssStylePaddingTopForEditorResizer({
  v,
  device,
  state,
  renderContext
}) {
  if (isEditor(renderContext)) {
    let r = "";
    const p = cssStylePadding({ v, device, state });

    r = `height:${p.paddingTop}${p.paddingTopSuffix};`;

    return r;
  }
}

export function cssStylePaddingBottomForEditorResizer({
  v,
  device,
  state,
  renderContext
}) {
  if (isEditor(renderContext)) {
    let r = "";
    const p = cssStylePadding({ v, device, state });

    r = `height:${p.paddingBottom}${p.paddingBottomSuffix};`;

    return r;
  }
}

export function cssStylePaddingRightLeftForEditor({
  v,
  device,
  state,
  renderContext
}) {
  if (isEditor(renderContext)) {
    let r = "";
    const p = cssStylePadding({ v, device, state });

    r = `padding-right:${p.paddingRight}${p.paddingRightSuffix};padding-left:${p.paddingLeft}${p.paddingLeftSuffix};`;

    return r;
  }
}

export function cssStylePadding({ v, device, state, prefix = "" }) {
  let paddingTop = 0;
  let paddingRight = 0;
  let paddingBottom = 0;
  let paddingLeft = 0;
  let paddingTopSuffix = "px";
  let paddingRightSuffix = "px";
  let paddingBottomSuffix = "px";
  let paddingLeftSuffix = "px";
  let paddingType = stylePaddingType({ v, device, state, prefix });

  if (paddingType === "grouped") {
    const padding = stylePaddingGrouped({ v, device, state, prefix });
    const suffix = stylePaddingGroupedSuffix({ v, device, state, prefix });

    paddingTop = padding;
    paddingRight = padding;
    paddingBottom = padding;
    paddingLeft = padding;

    paddingTopSuffix = suffix;
    paddingRightSuffix = suffix;
    paddingBottomSuffix = suffix;
    paddingLeftSuffix = suffix;
  } else {
    paddingTop = stylePaddingUngrouped({
      v,
      device,
      state,
      prefix,
      current: "paddingTop"
    });
    paddingRight = stylePaddingUngrouped({
      v,
      device,
      state,
      prefix,
      current: "paddingRight"
    });
    paddingBottom = stylePaddingUngrouped({
      v,
      device,
      state,
      prefix,
      current: "paddingBottom"
    });
    paddingLeft = stylePaddingUngrouped({
      v,
      device,
      state,
      prefix,
      current: "paddingLeft"
    });

    paddingTopSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      prefix,
      current: "paddingTopSuffix"
    });
    paddingRightSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      prefix,
      current: "paddingRightSuffix"
    });
    paddingBottomSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      prefix,
      current: "paddingBottomSuffix"
    });
    paddingLeftSuffix = stylePaddingUngroupedSuffix({
      v,
      device,
      state,
      prefix,
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

export function cssStylePaddingBG({ v, device, state }) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "bg" });
}
