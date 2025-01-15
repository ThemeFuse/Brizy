import { Num as NumReader } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import { wInFullPage } from "visual/config/columns";
import * as Num from "visual/utils/math";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State as StateMode } from "visual/utils/stateMode";
import * as Str from "visual/utils/string";
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

interface Margin {
  w: number;
  v: ElementModel;
  device: ResponsiveMode;
  type: "grouped" | "ungrouped";
  state?: StateMode;
}

interface Padding {
  w: number;
  v: ElementModel;
  device: ResponsiveMode;
  type: "grouped" | "ungrouped";
  state?: StateMode;
}

interface Border {
  v: ElementModel;
  device: ResponsiveMode;
  type: "grouped" | "ungrouped";
  state?: StateMode;
}

interface WidthByPosition {
  w: number;
  wNoSpacing: number;
  v: ElementModel;
  device: ResponsiveMode;
  state?: StateMode;
}

interface ContainerW {
  v: ElementModel;
  w: number;
  wNoSpacing: number;
  width?: number;
  device: ResponsiveMode;
  state?: StateMode;
}

interface WrapperContainerW {
  v: ElementModel;
  w: number;
  wNoSpacing: number;
  device: ResponsiveMode;
  state?: StateMode;
}

export const getMargin = ({ w, v, device, state, type }: Margin): number => {
  switch (type) {
    case "grouped": {
      const margin =
        NumReader.read(styleMarginGrouped({ v, device, state })) ?? 0;

      return percentageToPixels(
        margin * 2,
        styleMarginGroupedSuffix({ v, device, state }),
        w
      );
    }
    case "ungrouped": {
      const left =
        NumReader.read(
          styleMarginUngrouped({
            v,
            device,
            state,
            current: "marginLeft"
          })
        ) ?? 0;
      const leftSuffix = styleMarginUngroupedSuffix({
        v,
        device,
        state,
        current: "marginLeftSuffix"
      });
      const right =
        NumReader.read(
          styleMarginUngrouped({
            v,
            device,
            state,
            current: "marginRight"
          })
        ) ?? 0;
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

export const getPadding = ({ w, v, device, state, type }: Padding): number => {
  switch (type) {
    case "grouped": {
      const padding =
        NumReader.read(stylePaddingGrouped({ v, device, state })) ?? 0;

      return percentageToPixels(
        padding * 2,
        styleMarginGroupedSuffix({ v, device, state }),
        w
      );
    }
    case "ungrouped": {
      const left =
        NumReader.read(
          stylePaddingUngrouped({
            v,
            device,
            state,
            current: "paddingLeft"
          })
        ) ?? 0;
      const leftSuffix = stylePaddingUngroupedSuffix({
        v,
        device,
        state,
        current: "paddingLeftSuffix"
      });
      const right =
        NumReader.read(
          stylePaddingUngrouped({
            v,
            device,
            state,
            current: "paddingRight"
          })
        ) ?? 0;
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

export const getBorder = ({ v, device, state, type }: Border): number => {
  switch (type) {
    case "grouped": {
      const border =
        NumReader.read(styleBorderWidthGrouped({ v, device, state })) ?? 0;

      return border * 2;
    }
    case "ungrouped": {
      const leftBorder =
        NumReader.read(
          styleBorderWidthUngrouped({ v, device, state, current: "left" })
        ) ?? 0;
      const rightBorder =
        NumReader.read(
          styleBorderWidthUngrouped({ v, device, state, current: "right" })
        ) ?? 0;

      return leftBorder + rightBorder;
    }
    default: {
      return 0;
    }
  }
};

export const getWidthByPosition = ({
  w,
  wNoSpacing,
  v,
  device,
  state
}: WidthByPosition): { w: number; wNoSpacing: number } => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const position = Str.toString(dvv("elementPosition"));
  const width = Num.toNumber(dvv("width")) ?? w;
  const widthSuffix = Str.toString(dvv("widthSuffix")) ?? "px";

  if (position === "fixed") {
    const w = percentageToPixels(width, widthSuffix, wInFullPage);
    return { w, wNoSpacing: w };
  }

  if (position === "absolute") {
    const w = percentageToPixels(width, widthSuffix, wNoSpacing);
    return { w, wNoSpacing: w };
  }

  // margin is affected only position relative
  const marginType = styleMarginType({ v, device, state });
  const marginW = getMargin({ w, v, device, state, type: marginType });
  return { w: w - marginW, wNoSpacing };
};

export const getContainerW = ({
  v,
  w,
  wNoSpacing,
  width = 100,
  device = "desktop",
  state = "normal"
}: ContainerW): { w: number; wNoSpacing: number } => {
  const marginType = styleMarginType({ v, device, state });
  const marginW = getMargin({ w, v, device, state, type: marginType });
  const containerW = w * (width / 100) - marginW;
  const containerWNoSpacing = wNoSpacing * (width / 100);
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

  return {
    w: Math.round((containerW - externalSpacing) * 10) / 10,
    wNoSpacing: Math.round(containerWNoSpacing * 10) / 10
  };
};

export const getWrapperContainerW = ({
  v,
  w,
  wNoSpacing,
  device = "desktop",
  state = "normal"
}: WrapperContainerW): { w: number; wNoSpacing: number } => {
  const containerW = getWidthByPosition({ w, wNoSpacing, v, device, state });
  const paddingType = stylePaddingType({ v, device, state });
  const paddingW = getPadding({ w, v, device, state, type: paddingType });
  const borderType = styleBorderWidthType({ v, device, state });
  const borderWidthW = getBorder({ v, device, state, type: borderType });
  const externalSpacing = paddingW + borderWidthW;

  return {
    wNoSpacing: containerW.wNoSpacing,
    w: Math.round((containerW.w - externalSpacing) * 10) / 10
  };
};
