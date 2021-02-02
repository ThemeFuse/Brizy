import { getStore } from "visual/redux/store";
import { deviceModeSelector } from "visual/redux/selectors";
import {
  wInBoxedPage,
  wInFullPage,
  wInTabletPage,
  wInMobilePage
} from "visual/config/columns";
import { IS_STORY } from "visual/utils/models";
import { DW, DH } from "visual/editorComponents/Story/utils";

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
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/math";
import * as Str from "visual/utils/string";
import { ElementModel } from "visual/component/Elements/Types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State as StateMode } from "visual/utils/stateMode";

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
  width: number;
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

export const getPadding = ({ w, v, device, state, type }: Padding): number => {
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

export const getBorder = ({ v, device, state, type }: Border): number => {
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

export const getCurrentW = (): number => {
  if (IS_STORY) {
    return DW;
  }

  const deviceMode = deviceModeSelector(getStore().getState());
  switch (deviceMode) {
    case "tablet": {
      return wInTabletPage;
    }
    case "mobile": {
      return wInMobilePage;
    }
    default: {
      return wInBoxedPage;
    }
  }
};

export const getCurrentH = (): number => {
  return IS_STORY ? DH : window.innerHeight;
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
  const paddingW = getPadding({ v, device, state, w, type: paddingType });
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
