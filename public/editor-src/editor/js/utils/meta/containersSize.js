import {
  styleBorderWidthGrouped,
  styleBorderWidthType,
  styleBorderWidthUngrouped,
  styleMarginGrouped,
  styleMarginGroupedSuffix,
  styleMarginType,
  styleMarginUngrouped,
  styleMarginUngroupedSuffix,
  stylePaddingGrouped,
  stylePaddingType,
  stylePaddingUngrouped,
  stylePaddingUngroupedSuffix
} from "visual/utils/style2";
import { percentageToPixels } from "./percentageToPixels";

export const getMargin = ({ w, v, device, state, type }) => {
  switch (type) {
    case "grouped": {
      return percentageToPixels(
        styleMarginGrouped({ v, device, state }) * 2,
        styleMarginGroupedSuffix({ v, device, state }),
        w
      );
    }
    case "ungrouped": {
      const left = styleMarginUngrouped({
        v,
        device,
        state,
        current: "marginLeft"
      });
      const leftSuffix = styleMarginUngroupedSuffix({
        v,
        device,
        state,
        current: "marginLeftSuffix"
      });
      const right = styleMarginUngrouped({
        v,
        device,
        state,
        current: "marginRight"
      });
      const rightSuffix = styleMarginUngroupedSuffix({
        v,
        device,
        state,
        current: "marginRightSuffix"
      });

      return (
        percentageToPixels(left, leftSuffix, w) +
        percentageToPixels(right, rightSuffix, w)
      );
    }
    default: {
      return 0;
    }
  }
};

export const getPadding = ({ w, v, device, state, type }) => {
  switch (type) {
    case "grouped": {
      return percentageToPixels(
        stylePaddingGrouped({ v, device, state }) * 2,
        styleMarginGroupedSuffix({ v, device, state }),
        w
      );
    }
    case "ungrouped": {
      const left = stylePaddingUngrouped({
        v,
        device,
        state,
        current: "paddingLeft"
      });
      const leftSuffix = stylePaddingUngroupedSuffix({
        v,
        device,
        state,
        current: "paddingLeftSuffix"
      });
      const right = stylePaddingUngrouped({
        v,
        device,
        state,
        current: "paddingRight"
      });
      const rightSuffix = stylePaddingUngroupedSuffix({
        v,
        device,
        state,
        current: "paddingRightSuffix"
      });

      return (
        percentageToPixels(left, leftSuffix, w) +
        percentageToPixels(right, rightSuffix, w)
      );
    }
    default: {
      return 0;
    }
  }
};

export const getBorder = ({ v, device, state, type }) => {
  switch (type) {
    case "grouped": {
      return styleBorderWidthGrouped({ v, device, state }) * 2;
    }
    case "ungrouped": {
      return (
        styleBorderWidthUngrouped({ v, device, state, current: "left" }) +
        styleBorderWidthUngrouped({ v, device, state, current: "right" })
      );
    }
    default: {
      return 0;
    }
  }
};

export const getContainerW = ({
  v,
  w = 100,
  width = 100,
  device = "desktop",
  state = "normal"
}) => {
  const marginType = styleMarginType({ v, device, state });
  const marginW = getMargin({ w, v, device, state, type: marginType });
  const containerW = (w - marginW) * (width / 100);
  const paddingType = stylePaddingType({ v, device, state });
  const borderType = styleBorderWidthType({ v, device, state });
  const paddingW = getPadding({
    v,
    device,
    state,
    w: containerW,
    type: paddingType
  });
  const borderWidthW = getBorder({ v, device, state, type: borderType });
  const externalSpacing = paddingW + borderWidthW;

  return Math.round((containerW - externalSpacing) * 10) / 10;
};
